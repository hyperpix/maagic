"use client";

import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/admin-sidebar";
import { UserSidebar } from "@/components/user-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { ComposerPrimitive } from "@assistant-ui/react";
import "@/components/assistant-ui/attachment";
import { useAdminRuntime } from "@/lib/use-admin-runtime";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [selectedId, setSelectedId] = useState<any>(null);

  const conversations = useQuery(api.conversations.getConversations);
  const messages = useQuery(
    api.messages.getMessages,
    selectedId ? { conversationId: selectedId } : "skip"
  );

  const runtime = useAdminRuntime(selectedId);

  return (
    <SidebarProvider>
      <AdminSidebar
        selectedId={selectedId}
        onSelectConversation={setSelectedId}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h2 className="font-medium">
              {selectedId
                ? `Conversation with ${conversations?.find((c: any) => c._id === selectedId)?.visitorId}`
                : "Inbox"}
            </h2>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedId ? (
            <>
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
                            ? "bg-muted text-black self-end"
                            : "bg-background text-foreground border border-gray-200 self-start"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 bg-background">
                <div className="max-w-3xl mx-auto">
                  <AssistantRuntimeProvider runtime={runtime}>
                    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col">
                      <div className="flex w-full flex-col rounded-2xl border border-input bg-background px-1 pt-2 outline-none transition-shadow has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/20">
                        <ComposerPrimitive.Input
                          placeholder="Type a reply..."
                          className="aui-composer-input mb-1 max-h-32 min-h-14 w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
                          rows={1}
                          aria-label="Message input"
                        />
                        <div className="aui-composer-action-wrapper relative mx-2 mb-2 flex items-center justify-end">
                          <ComposerPrimitive.Send asChild>
                            <Button type="button" variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground">
                              Send
                            </Button>
                          </ComposerPrimitive.Send>
                        </div>
                      </div>
                    </ComposerPrimitive.Root>
                  </AssistantRuntimeProvider>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </SidebarInset>
      <UserSidebar selectedId={selectedId} conversations={conversations} />
    </SidebarProvider>
  );
}