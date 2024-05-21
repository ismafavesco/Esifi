import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import prismadb from "@/lib/prismadb";
import { ChatCompletionRequestMessage } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const PRE_PROMPT: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content:
      "You are Esifi, an advanced chatbot created by Favesco. Your purpose is to engage in conversation and assist users to the best of your abilities while being as human-like as possible.",
  },
];

export async function POST(req: Request) {
  const { pathname } = new URL(req.url);

  if (pathname === "/api/conversation") {
    try {
      const { userId } = auth();
      const body = await req.json();
      let { messages } = body;

      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (!configuration.apiKey) {
        return new NextResponse("OpenAI API Key not configured.", { status: 500 });
      }

      if (!messages) {
        return new NextResponse("Messages are required", { status: 400 });
      }

      messages = [...PRE_PROMPT, ...messages];

      const freeTrial = await checkApiLimit();
      const isPro = await checkSubscription();

      if (!freeTrial && !isPro) {
        return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
      }

      const response = await openai.createChatCompletion({
        model: "gpt-4o",
        messages,
      });

      if (!isPro) {
        await incrementApiLimit();
      }

      return NextResponse.json(response.data.choices[0].message);
    } catch (error) {
      console.log("[CONVERSATION_ERROR]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  } else if (pathname === "/api/conversation/conversations") {
    try {
      const { userId } = auth();
      const body = await req.json();
      const { messages } = body;
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const conversationData = {
        userId,
        messages: JSON.stringify(messages),
      };
      await prismadb.conversation.create({ data: conversationData });
      return new NextResponse("Conversation saved successfully", {
        status: 200,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
      return new NextResponse("Error saving conversation", { status: 500 });
    }
  }
}