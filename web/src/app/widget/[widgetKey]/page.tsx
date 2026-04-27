import { ChatWidget } from "@/components/chat/ChatWidget";

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ widgetKey: string }>;
}) {
  const { widgetKey } = await params;
  return (
    <div className="min-h-screen bg-transparent">
      <ChatWidget widgetKey={widgetKey} />
    </div>
  );
}
