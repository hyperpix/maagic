"use client";

import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ExternalStoreAdapter,
  useExternalStoreRuntime
} from "@assistant-ui/react";
import { useEffect, useMemo, useState } from "react";

export const useConvexRuntime = ({ widgetKey }: { widgetKey: string }) => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const storageKey = `chat_conversation_id_${widgetKey}`;

  const clearChat = () => {
    localStorage.removeItem(storageKey);
    setConversationId(null);
  };

  const createConversation = useMutation(api.conversations.createConversation);
  const sendMessageMutation = useMutation(api.messages.sendMessage);
  const generateAIResponse = useAction(api.ai.generateAIResponse);

  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  useEffect(() => {
    let id = localStorage.getItem("chat_visitor_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_visitor_id", id);
    }
    setVisitorId(id);

    const convId = localStorage.getItem(storageKey);
    if (convId) {
      setConversationId(convId);
    }
  }, [storageKey]);

  const store = useMemo((): ExternalStoreAdapter => {
    return {
      isRunning: isGenerating,
      isLoading: conversationId ? messages === undefined : false,
      messages: (messages || []).map((msg: any) => ({
        id: msg._id,
        role: (msg.sender === "visitor" ? "user" : "assistant") as "user" | "assistant",
        content: [{ type: "text" as const, text: msg.content as string }],
        createdAt: new Date(msg.createdAt),
        attachments: [] as [],
        status: { type: "complete" as const, reason: "stop" as const },
        metadata: { custom: {} },
      })) as any[],
      onNew: async (message) => {
        if (!visitorId || !widgetKey) return;

        let currentConvId = conversationId;
        if (!currentConvId) {
          currentConvId = await createConversation({ widgetKey, visitorId });
          setConversationId(currentConvId);
          localStorage.setItem(storageKey, currentConvId as string);
        }

        const text = message.content
          .filter((c) => c.type === "text")
          .map((c) => (c as any).text)
          .join("\n");

        await sendMessageMutation({
          conversationId: currentConvId,
          sender: "visitor",
          content: text,
        });

        setIsGenerating(true);
        try {
          await generateAIResponse({
            conversationId: currentConvId,
            userMessage: text,
          });
        } catch (error) {
          console.error("Error generating AI response:", error);
        } finally {
          setIsGenerating(false);
        }
      },
      adapters: {
        attachments: {
          add: async () => { throw new Error("Not supported"); },
          remove: async () => {},
          accept: "*",
          send: async () => { throw new Error("Not supported"); },
        },
        feedback: { submit: async () => {} },
      },
    };
  }, [messages, visitorId, conversationId, widgetKey, storageKey, createConversation, sendMessageMutation, generateAIResponse, isGenerating]);

  const runtime = useExternalStoreRuntime(store);
  return { runtime, clearChat };
};
