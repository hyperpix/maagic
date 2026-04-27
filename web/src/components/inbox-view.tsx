"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AssistantRuntimeProvider, ComposerPrimitive } from "@assistant-ui/react";
import { useAdminRuntime } from "@/lib/use-admin-runtime";
import { InboxSidebar } from "@/components/inbox-sidebar";
import { UserSidebar } from "@/components/user-sidebar";

function getInitials(visitorId: string) {
  if (!visitorId) return "?";
  const parts = visitorId.split(/[-_]/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return visitorId.substring(0, 2).toUpperCase();
}

function truncateMessage(text: string, maxLength = 60) {
  return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
}

function formatTime(timestamp: number) {
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function InboxView({ agentId }: { agentId: Id<"agents"> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const conversations = useQuery(api.conversations.getConversations, { agentId });
  const conversation = useQuery(
    api.conversations.getConversation,
    selectedId ? { conversationId: selectedId as any } : "skip"
  );
  const messages = useQuery(
    api.messages.getMessages,
    selectedId ? { conversationId: selectedId as any } : "skip"
  );
  const markOpened = useMutation(api.conversations.markConversationOpened);
  const setHumanMode = useMutation(api.conversations.setHumanMode);
  const isHumanMode = conversation?.humanMode ?? false;
  const runtime = useAdminRuntime(selectedId, isHumanMode);

  const conversationsWithLastMessage = useMemo(() => {
    if (!conversations) return [];
    return conversations.map((conv: any) => ({ ...conv, lastMessage: null }));
  }, [conversations]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Inbox list */}
      <div className="w-80 border-r flex-shrink-0 flex flex-col h-full">
        <InboxSidebar
          data={conversationsWithLastMessage}
          onRowClick={async (id) => {
            setSelectedId(id);
            await markOpened({ conversationId: id as any });
          }}
          getInitials={getInitials}
          truncateMessage={truncateMessage}
          formatTime={formatTime}
          isLoading={conversations === undefined}
          selectedId={selectedId}
        />
      </div>

      {/* Conversation detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground text-sm">
                Click on a conversation to view the full message history.
              </p>
            </div>
          </div>
        ) : (
          <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedId(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-medium text-sm truncate">
                {`Visitor ${conversation?.visitorId?.substring(0, 8) ?? ""}`}
              </h2>
            </header>

            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-3 max-w-3xl mx-auto">
                {messages === undefined ? (
                  <p className="text-center text-muted-foreground text-xs">Loading...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-muted-foreground text-xs">No messages yet.</p>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg._id}
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        msg.sender === "agent"
                          ? "bg-muted text-foreground self-end"
                          : "bg-background text-foreground border self-start"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="max-w-3xl mx-auto space-y-3">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-muted-foreground">
                    {isHumanMode ? "Human Mode" : "AI Mode"}
                  </span>
                  <Button
                    variant={isHumanMode ? "primary" : "outline"}
                    size="sm"
                    onClick={() =>
                      setHumanMode({ conversationId: selectedId as any, humanMode: !isHumanMode })
                    }
                  >
                    {isHumanMode ? "Switch to AI" : "Take Over (Human)"}
                  </Button>
                </div>
                <AssistantRuntimeProvider runtime={runtime}>
                  <ComposerPrimitive.Root className="relative flex w-full flex-col">
                    <div className="flex w-full flex-col rounded-2xl border border-input bg-background px-1 pt-2">
                      <ComposerPrimitive.Input
                        placeholder={isHumanMode ? "Type a reply..." : "AI will respond automatically..."}
                        className="mb-1 max-h-32 min-h-14 w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm outline-none placeholder:text-muted-foreground"
                        rows={1}
                        aria-label="Message input"
                      />
                      <div className="mx-3 mb-3 flex items-center justify-between">
                        <div />
                        <ComposerPrimitive.Send asChild>
                          <Button size="sm">Send</Button>
                        </ComposerPrimitive.Send>
                      </div>
                    </div>
                  </ComposerPrimitive.Root>
                </AssistantRuntimeProvider>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedId && (
        <UserSidebar
          selectedId={selectedId}
          conversations={conversations}
          onDeleteConversation={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
