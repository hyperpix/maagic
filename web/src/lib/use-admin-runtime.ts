"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  ExternalStoreAdapter,
  useExternalStoreRuntime
} from "@assistant-ui/react";
import { useMemo } from "react";

export const useAdminRuntime = (conversationId: string | null, isHumanMode: boolean = false) => {
  const sendMessageMutation = useMutation(api.messages.sendMessage);

  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId: conversationId as Id<"conversations"> } : "skip"
  );

  const store = useMemo((): ExternalStoreAdapter => {
    return {
      isRunning: false,
      isLoading: messages === undefined,
      messages: (messages || []).map((msg: any) => ({
        id: String(msg._id),
        role: (msg.sender === "visitor" ? "user" : "assistant") as "user" | "assistant",
        content: [{ type: "text" as const, text: String(msg.content ?? "") }],
        createdAt: new Date(msg.createdAt),
        attachments: [] as [],
        status: { type: "complete" as const, reason: "stop" as const },
        metadata: { custom: {} },
      })) as any[],
      onNew: async (message) => {
        if (!conversationId) return;

        const text = message.content
          .filter((c) => c.type === "text")
          .map((c) => (c as any).text)
          .join("\n");

        // Save agent message (manual response)
        await sendMessageMutation({
          conversationId: conversationId as Id<"conversations">,
          sender: "agent",
          content: text,
        });
      },
      adapters: {
        attachments: {
          add: async () => { throw new Error("Not supported"); },
          remove: async () => { },
          accept: "*",
          send: async () => { throw new Error("Not supported"); },
        },
        feedback: {
          submit: async () => { },
        },
      },
    };
  }, [messages, conversationId, sendMessageMutation, isHumanMode]);

  return useExternalStoreRuntime(store);
};