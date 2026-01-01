"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  ExternalStoreAdapter,
  useExternalStoreRuntime
} from "@assistant-ui/react";
import { useEffect, useMemo, useState } from "react";

export const useConvexRuntime = () => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<any>(null);

  const createConversation = useMutation(api.conversations.createConversation);
  const sendMessageMutation = useMutation(api.messages.sendMessage);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitorId(id);

    const convId = localStorage.getItem("chat_conversation_id");
    if (convId) {
      setConversationId(convId);
    }
  }, []);

  const store = useMemo((): ExternalStoreAdapter => {
    return {
      isRunning: false,
      isLoading: conversationId ? messages === undefined : false,
      messages: (messages || []).map((msg: any) => ({
        id: msg._id,
        role: msg.sender === "visitor" ? "user" : "assistant",
        content: [{ type: "text", text: msg.content }],
        createdAt: new Date(msg.createdAt),
        attachments: [],
        metadata: {
          custom: {},
        },
      })),
      onNew: async (message) => {
        if (!visitorId) return;

        let currentConvId = conversationId;
        if (!currentConvId) {
          currentConvId = await createConversation({ visitorId });
          setConversationId(currentConvId);
          localStorage.setItem("chat_conversation_id", currentConvId as string);
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
  }, [messages, visitorId, conversationId, createConversation, sendMessageMutation]);

  return useExternalStoreRuntime(store);
};
