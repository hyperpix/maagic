import { ChatWidget } from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center">
      <ChatWidget />
    </div>
  );
}
