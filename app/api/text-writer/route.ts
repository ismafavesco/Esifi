import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content: "You are an AI text writer. Generate humanized text based on the provided prompt. Make the text engaging and creative.",
};

async function humanizeText(
  text: string,
  readability: string,
  purpose: string,
  strength: string
): Promise<string> {
  const myHeaders = new Headers();
  myHeaders.append("api-key", process.env.UNDETECTABLE_AI_API_KEY!);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    content: text,
    readability,
    purpose,
    strength,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch("https://api.undetectable.ai/submit", requestOptions);
  const result = await response.json();

  const documentId = result.id;

  // Poll the Undetectable.AI API every 30 seconds to check if the document is processed
  let humanizedText = "";
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    const documentResponse = await fetch("https://api.undetectable.ai/document", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ id: documentId }),
      redirect: "follow",
    });

    const documentResult = await documentResponse.json();

    if (documentResult.status === "done") {
      humanizedText = documentResult.output;
      break;
    }
  }

  return humanizedText;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { content, readability, purpose, strength, maxWords } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        instructionMessage,
        { role: "user", content: `${content}\n\nMaximum words: ${maxWords}` },
      ],
    });

    const generatedText = response.data.choices[0].message?.content || "";

 // Truncate the generated text to the specified maximum word count
 const words = generatedText.trim().split(/\s+/);
 const truncatedText = words.slice(0, maxWords).join(" ");

 const humanizedText = await humanizeText(truncatedText, readability, purpose, strength);
 
    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json({ text: humanizedText });
  } catch (error) {
    console.log("[TEXT_WRITER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}