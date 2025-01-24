import {NextRequest, NextResponse} from "next/server";
import {getRedisClient} from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const redis = getRedisClient();

    const { bodyText, currentUrl } = await  req.json();

    if (!bodyText || !currentUrl) {
      return NextResponse.json({error: "data not found"}, {status: 403})
    }

    const data = await redis.get(currentUrl);

    if (data) {
      return NextResponse.json({status: 200})
    }

    await redis.set(currentUrl, bodyText, "EX", 86400);
    const savedData = redis.get(currentUrl)

    if (!savedData) {
      return NextResponse.json({error: "failed to cache data"}, {status: 500})
    }

    return NextResponse.json({status: 200})
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: "failed to process request"}, {status: 500})
  }
}