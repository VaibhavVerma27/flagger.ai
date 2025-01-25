import {NextRequest, NextResponse} from "next/server";
import {getRedisClient} from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: Promise<{url: string}> }) {
  try {
    const redis = getRedisClient();

    const { url } = await params;

    if (!url || Array.isArray(url)) {
      return NextResponse.json({error: "url not found or is not valid"}, {status: 403})
    }

    const decodedUrl = decodeURIComponent(url);

    const data = await redis.get(decodedUrl);

    if (!data) {
      return NextResponse.json({status: 404})
    }

    return NextResponse.json(data, {status: 200})
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: "failed to process request"}, {status: 500})
  }
}