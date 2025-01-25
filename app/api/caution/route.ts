import { QdrantClient } from '@qdrant/js-client-rest';
import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import Groq from 'groq-sdk';
import prisma from "@/lib/prisma";

// Define error interfaces
interface QdrantError extends Error {
    status?: number;
}

interface CollectionConfig {
    config: {
        params: {
            vectors?: {
                size?: number;
            };
        };
    };
}

if (!process.env.GOOGLE_API_KEY || !process.env.QDRANT_URL || !process.env.QDRANT_API_KEY || !process.env.GROQ_API_KEY) {
    throw new Error('Required environment variables are not defined');
}

const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
});

const validateQdrantConnection = async (): Promise<void> => {
    try {
        await qdrantClient.getCollections();
    } catch (error) {
        const err = error as Error;
        throw new Error(`Failed to connect to Qdrant: ${err.message || 'Unknown error'}`);
    }
};

const ensureCollection = async (
    collectionName: string,
    vectorSize: number
): Promise<void> => {
    if (!collectionName || !vectorSize) {
        throw new Error('Collection name and vector size are required');
    }

    const maxRetries = 3;
    let currentTry = 0;

    while (currentTry < maxRetries) {
        try {
            try {
                const collection = await qdrantClient.getCollection(collectionName) as CollectionConfig;
                console.log(`Collection ${collectionName} exists with config:`, collection);

                // Validate vector size matches
                if (!collection.config.params.vectors || collection.config.params.vectors.size === undefined || collection.config.params.vectors.size !== vectorSize) {
                    throw new Error(`Vector size mismatch. Expected: ${vectorSize}, Got: ${collection.config.params.vectors?.size}`);
                }
                return;
            } catch (error) {
                const qdrantError = error as QdrantError;
                if (qdrantError.status !== 404) {
                    throw qdrantError;
                }
            }

            const collectionConfig = {
                vectors: {
                    size: vectorSize,
                    distance: 'Cosine' as const,
                },
                optimizers_config: {
                    default_segment_number: 2,
                },
                replication_factor: 2,
                write_consistency_factor: 1,
            };

            await qdrantClient.createCollection(collectionName, collectionConfig);
            console.log(`Created new collection: ${collectionName}`);

            // Validate collection was created
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newCollection = await qdrantClient.getCollection(collectionName);

            if (!newCollection) {
                throw new Error('Collection creation verification failed');
            }

            return;
        } catch (error) {
            currentTry++;
            const err = error as Error;
            console.error(`Attempt ${currentTry}/${maxRetries} failed:`, err);

            if (currentTry === maxRetries) {
                throw new Error(`Collection creation failed after ${maxRetries} attempts: ${err.message || 'Unknown error'}`);
            }

            await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentTry) * 1000));
        }
    }
};

const createVectorStore = async (
    text: string,
    collectionName: string
): Promise<void> => {
    if (!text?.trim()) {
        throw new Error('No text provided for vector store creation');
    }

    await validateQdrantConnection();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const documentTexts = await textSplitter.splitText(text);

    if (!documentTexts.length) {
        throw new Error('No text chunks generated');
    }

    const embeds = await Promise.all(
        documentTexts.map(text => embeddings.embedQuery(text))
    );

    if (!embeds.length || !embeds[0].length) {
        throw new Error('Failed to generate embeddings');
    }

    await ensureCollection(collectionName, embeds[0].length);

    const points = documentTexts.map((text, i) => ({
        id: Date.now() + i,
        vector: Array.from(embeds[i]),
        payload: {
            text: text.trim(),
            timestamp: new Date().toISOString(),
            chunkIndex: i
        }
    }));

    await qdrantClient.upsert(collectionName, { points });
};

interface QdrantPoint {
    payload?: {
        text?: string;
    };
}

const getAllCollectionPoints = async (collectionName: string): Promise<QdrantPoint[]> => {
    try {
        let allPoints: QdrantPoint[] = [];
        let scrollPoint = null;

        do {
            const response = await qdrantClient.scroll(collectionName, {
                limit: 100,
                offset: scrollPoint,
                with_payload: true,
                with_vector: false
            });

            allPoints = [
                ...allPoints,
                ...response.points as QdrantPoint[]
            ];
            scrollPoint = response.next_page_offset;
        } while (scrollPoint);

        return allPoints;
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching collection points:', err);
        throw err;
    }
};

const chunkText = (text: string, maxChunkSize: number = 15000): string[] => {
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const word of words) {
        if ((currentChunk + ' ' + word).length <= maxChunkSize) {
            currentChunk += (currentChunk ? ' ' : '') + word;
        } else {
            chunks.push(currentChunk);
            currentChunk = word;
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
};

const getBotResponse = async (
    collectionName: string,
): Promise<string> => {
    try {
        const allPoints = await getAllCollectionPoints(collectionName);

        if (!allPoints.length) {
            return 'No data found in the collection';
        }

        const fullContext = allPoints
            .map(point => point.payload?.text || '')
            .join(" ");

        // Split context into manageable chunks
        const contextChunks = chunkText(fullContext);
        const analysisPromises = contextChunks.map(async (chunk) => {
            const prompt = `You are a helpful bot which warns the user about various Cautions in Terms and Conditions of a Website. Analyze this section of the terms and conditions for flaws, unclear language, data vulnerabilities, and security concerns. If you find any issues, list them clearly. Here is the text section to analyze: ${chunk}`;

            try {
                const completion = await groqClient.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'llama-3.3-70b-versatile',
                });
                
                return completion.choices[0]?.message?.content ?? '';
            } catch (error) {
                console.error('Error processing chunk:', error);
                return '';
            }
        });

        // Process all chunks and combine results
        const chunkResults = await Promise.all(analysisPromises);
        
        // Combine and summarize the results
        const combinedAnalysis = chunkResults.filter(result => result).join('\n\n');
        
        if (!combinedAnalysis) {
            return 'Unable to analyze the terms and conditions';
        }

        // Generate a final summary
        const summaryPrompt = `Here are the analyses of different sections of a terms and conditions document. Please provide a clear, organized summary of all the key issues and concerns found: ${combinedAnalysis}`;

        const finalSummary = await groqClient.chat.completions.create({
            messages: [{ role: 'user', content: summaryPrompt }],
            model: 'llama3-8b-8192',
        });

        return finalSummary.choices[0]?.message?.content ?? 'No content';

    } catch (error) {
        const err = error as Error;
        console.error('Bot response error:', err);
        return "Error analyzing terms and conditions";
    }
};

export async function POST(request: Request) {
    try {
        const  { text, collectionNameU } = await request.json();

        if (!collectionNameU || !text) {
            return NextResponse.json({ error: 'website name and text is required' }, { status: 400 });
        }

        const collectionName = decodeURIComponent(collectionNameU)

        const alreadyProcessed = await prisma.website.findFirst({where: {websiteURL: collectionName}});

        if (alreadyProcessed) {
            return NextResponse.json(alreadyProcessed.text, { status: 200 });
        }

        if (text) {
            await createVectorStore(text, collectionName);
        }

        const response = await getBotResponse(collectionName);

        await prisma.website.create({
            data: {
                text: response,
                websiteURL: collectionName,
                createdAt: new Date().toISOString(),
            }
        })

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        const err = error as Error;
        console.error('API error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}