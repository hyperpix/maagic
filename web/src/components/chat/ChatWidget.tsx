"use client";

import { useConvexRuntime } from "@/lib/use-chat-runtime";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { AssistantRuntimeProvider } from "@assistant-ui/react";

export const ChatWidget = () => {
  const { runtime, clearChat } = useConvexRuntime();

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantModal clearChat={clearChat} />
    </AssistantRuntimeProvider>
  );
};
