import { auth } from "@clerk/nextjs";
import { ElevenLabsClient } from "elevenlabs";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const isProduction = process.env.NEXT_PUBLIC_APP_MODE === "production";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message, voice } = await req.json();

  const freeTrial = await checkApiLimit();
  const isPro = await checkSubscription();

  if (!freeTrial && !isPro) {
    return new Response("Free trial has expired. Please upgrade to pro.", { status: 403 });
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: isProduction ? process.env.ELEVENLABS_API_KEY : process.env.ELEVENLABS_API_KEY,
  });

  try {
    const audio = await elevenlabs.generate({
      voice,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        similarity_boost: 0.5,
        stability: 0.5,
      },
      text: message,
    });

    if (!isPro) {
      await incrementApiLimit();
    }

    return new Response(audio as any, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error: any) {
    console.error(error);
    return Response.json(error, { status: error.statusCode });
  }
}