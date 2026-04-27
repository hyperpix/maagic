import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ widgetKey: string }>;
}) {
  const { widgetKey } = await params;

  const agent = await fetchQuery(api.agents.getAgentByWidgetKey, { widgetKey });
  if (!agent) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <ChatWidget widgetKey={widgetKey} />
    </div>
  );
}
