"use client";

import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar: Conversation List */}
      <aside className="w-80 border-r flex flex-col bg-muted/30" role="complementary">
        <header className="p-4 border-b bg-background">
          <h1 className="font-semibold text-lg">Admin Inbox</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          {/* Conversation list will go here */}
          <div className="p-4 text-center text-muted-foreground text-sm">
            Select a conversation to start chatting
          </div>
        </div>
      </aside>

      {/* Main Content: Message View */}
      <main className="flex-1 flex flex-col" role="main">
        {/* Messages and input will go here */}
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No conversation selected
        </div>
      </main>
    </div>
  );
}