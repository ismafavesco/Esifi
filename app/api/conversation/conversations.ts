import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export const POST = async (request: Request) => {
  try {
    const { userId } = auth();
    const { messages } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const conversationData = {
      userId,
      messages: JSON.stringify(messages),
    };

    await prismadb.conversation.create({
      data: conversationData,
    });

    return NextResponse.json({ message: "Conversation saved successfully" });
  } catch (error) {
    console.error("Error saving conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};