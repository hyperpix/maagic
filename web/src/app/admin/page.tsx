"use client";

import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState<any>(null);
  const conversations = useQuery(api.conversations.getConversations);

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
          <div className="flex-1 flex flex-col">
             {/* Messages will go here */}
             <div className="p-4 border-b">
               Selected: {selectedId}
             </div>
             <div className="flex-1 overflow-y-auto p-4">
               Messages coming soon...
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
