"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Conversation } from "@/app/api/conversation/types";
import { Heading } from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { Empty } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ConversationList = () => {
  const { userId } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!userId) return;
        const response = await axios.get(`/api/conversation/conversations?userId=${userId}`);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [userId]);

  const handleViewConversation = (conversation: Conversation) => {
    // Navigate to the conversation page with the conversation data
    router.push(`/conversation?conversationId=${conversation.id}&messages=${encodeURIComponent(conversation.messages)}`);
  };

  return (
    <div>
      <Heading
        title="Conversations"
        description="View and access your saved conversations."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        {conversations.length === 0 ? (
          <Empty label="No saved conversations." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white border border-black/10 rounded-lg p-4 flex flex-col justify-between"
              >
                <p className="text-sm">{conversation.messages.slice(0, 50)}...</p>
                <Button
                  onClick={() => handleViewConversation(conversation)}
                  className="mt-2"
                >
                  View Conversation
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;