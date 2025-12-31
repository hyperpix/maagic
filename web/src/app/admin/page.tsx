"use client";

import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState<any>(null);
  const [reply, setReply] = useState("");
  
  const conversations = useQuery(api.conversations.getConversations);
  const messages = useQuery(
    api.messages.getMessages,
    selectedId ? { conversationId: selectedId } : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selectedId) return;

    await sendMessage({
      conversationId: selectedId,
      sender: "agent",
      content: reply.trim(),
    });

    setReply("");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar: Conversation List */}
      <aside className="w-80 border-r flex flex-col bg-muted/30" role="complementary">
        <header className="p-4 border-b bg-background">
          <h1 className="font-semibold text-lg">Admin Inbox</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          {conversations === undefined ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No conversations yet
            </div>
          ) : (
            <div className="flex flex-col">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedId(conv._id)}
                  className={cn(
                    "w-full text-left p-4 border-b transition-colors hover:bg-accent/50",
                    selectedId === conv._id && "bg-accent"
                  )}
                >
                  <div className="font-medium text-sm truncate">
                    {conv.visitorId}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(conv.createdAt).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content: Message View */}
      <main className="flex-1 flex flex-col" role="main">
        {selectedId ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="p-4 border-b bg-background flex items-center justify-between">
              <h2 className="font-medium">
                Conversation with {conversations?.find(c => c._id === selectedId)?.visitorId}
              </h2>
            </header>
            
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {messages === undefined ? (
                  <div className="text-center text-muted-foreground text-xs">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-xs">No messages yet.</div>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg._id}
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        msg.sender === "agent"
                          ? "bg-primary text-primary-foreground self-end"
                          : "bg-muted self-start"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
                <Input
                  placeholder="Type a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a conversation to start chatting
          </div>
        )}
      </main>
    </div>
  );
}