"use client";

import { useConvexRuntime } from "@/lib/use-chat-runtime";
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";
import { AssistantRuntimeProvider } from "@assistant-ui/react";

interface ChatWidgetProps {
  widgetKey: string;
}

export const ChatWidget = ({ widgetKey }: ChatWidgetProps) => {
  const { runtime, clearChat } = useConvexRuntime({ widgetKey });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantModal clearChat={clearChat} />
    </AssistantRuntimeProvider>
  );
};
