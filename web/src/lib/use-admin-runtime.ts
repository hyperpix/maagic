"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ExternalStoreAdapter,
  useExternalStoreRuntime
} from "@assistant-ui/react";
import { useMemo } from "react";

export const useAdminRuntime = (conversationId: string | null) => {
  const sendMessageMutation = useMutation(api.messages.sendMessage);

  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  const store = useMemo((): ExternalStoreAdapter => {
    return {
      isRunning: false,
      isLoading: messages === undefined,
      messages: (messages || []).map((msg: any) => {
        if (!msg?._id || !msg?.sender || typeof msg?.createdAt !== 'number') {
          console.warn("Skipping invalid message:", msg);
          return null;
        }

        try {
          const mapped = {
            id: String(msg._id),
            role: msg.sender === "agent" ? "user" : "assistant",
            content: [{ type: "text", text: String(msg.content ?? "") }],
            createdAt: new Date(msg.createdAt),
            attachments: [],
            metadata: {
              custom: {},
            },
          };
          return mapped;
        } catch (error) {
          console.error("Error processing message:", msg, error);
          return null;
        }
      }).filter((m: any) => m !== null),
      onNew: async (message) => {
        if (!conversationId) return;

        const text = message.content
          .filter((c) => c.type === "text")
          .map((c) => (c as any).text)
          .join("\n");

        await sendMessageMutation({
          conversationId,
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
  }, [messages, conversationId, sendMessageMutation]);

  return useExternalStoreRuntime(store);
};