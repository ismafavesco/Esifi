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

  const freeTrial = await checkApiLimit();
  const isPro = await checkSubscription();
  if (!freeTrial && !isPro) {
    return new Response("Free trial has expired. Please upgrade to pro.", {
      status: 403,
    });
  }

  const formData = await req.formData();
  const voice = formData.get("voice") as string;
  const text = formData.get("text") as string;
  const audioFile = formData.get("audio") as File;

  console.log("Received form data:", { voice, text, audioFile });

  if (!voice || (!text && !audioFile)) {
    return new Response("Missing required fields.", { status: 400 });
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: isProduction
      ? process.env.ELEVENLABS_API_KEY
      : process.env.ELEVENLABS_API_KEY,
  });

  try {
    let audioData;
    if (text) {
      console.log("Sending request to ElevenLabs API with text:", {
        voice,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          similarity_boost: 0.5,
          stability: 0.6,
          style: 0.1,
        },
        text,
      });
      audioData = await elevenlabs.generate({
        voice: voice,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          similarity_boost: 0.5,
          stability: 0.6,
          style: 0.1,
        },
        text: text,
      });
    } else if (audioFile) {
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("model_id", "eleven_english_sts_v2");
      formData.append(
        "voice_settings",
        JSON.stringify({
          similarity_boost: 0.8,
          stability: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        })
      );

      const headers = new Headers();
      headers.append(
        "xi-api-key",
        isProduction
          ? process.env.ELEVENLABS_API_KEY || ""
          : process.env.ELEVENLABS_API_KEY || ""
      );

      const response = await fetch(
        `https://api.elevenlabs.io/v1/speech-to-speech/${voice}`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (response.ok) {
        audioData = await response.arrayBuffer();
      } else {
        const errorMessage = await response.text();
        console.error("Error generating speech:", errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }

    console.log("Received audio data from ElevenLabs API.");

    if (!isPro) {
      await incrementApiLimit();
    }

    return new Response(audioData as any, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    console.error("Error generating speech:", error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}