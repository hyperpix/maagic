"use client";

import { useState, useMemo } from "react";
import * as React from "react";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/admin-sidebar";
import { UserSidebar } from "@/components/user-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { ComposerPrimitive } from "@assistant-ui/react";
import "@/components/assistant-ui/attachment";
import { useAdminRuntime } from "@/lib/use-admin-runtime";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InboxSidebar } from "@/components/inbox-sidebar";
import { KnowledgeSidebar } from "@/components/knowledge-sidebar";
import { HomePage } from "@/components/home-page";
import { AnalyticsPage } from "@/components/analytics-page";
import { AddDataSourceDialog } from "@/components/add-data-source-dialog";

type View = "home" | "inbox" | "analytics" | "knowledge" | "orders" | "issues" | "settings";

export default function AdminPage() {
  const [view, setView] = useState<View>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addDataSourceOpen, setAddDataSourceOpen] = useState(false);
  const [isEditingKnowledge, setIsEditingKnowledge] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const markOpened = useMutation(api.conversations.markConversationOpened);
  const updateKnowledgeItem = useMutation(api.knowledge.updateKnowledgeItem);
  const deleteKnowledgeItem = useMutation(api.knowledge.deleteKnowledgeItem);
  
  const conversations = useQuery(api.conversations.getConversations);
  const allMessages = useQuery(api.messages.getAllMessages);
  const messages = useQuery(
    api.messages.getMessages,
    selectedId && view !== "knowledge" ? { conversationId: selectedId } : "skip"
  );
  const knowledgeItems = useQuery(api.knowledge.getKnowledgeItems);

  // Update edit state when selected knowledge item changes
  React.useEffect(() => {
    if (view === "knowledge" && selectedId && knowledgeItems) {
      const selectedItem = knowledgeItems.find((item: any) => item._id === selectedId);
      if (selectedItem && !isEditingKnowledge) {
        setEditTitle(selectedItem.title);
        setEditDescription(selectedItem.description || "");
        setEditContent(selectedItem.content);
      }
    }
  }, [selectedId, knowledgeItems, view, isEditingKnowledge]);

  const runtime = useAdminRuntime(view !== "knowledge" ? selectedId : null);

  // Compute last message for each conversation
  const conversationsWithLastMessage = useMemo(() => {
    if (!conversations || !allMessages) return [];
    
    return conversations.map((conv: any) => {
      const convMessages = allMessages.filter((msg: any) => msg.conversationId === conv._id);
      const lastMessage = convMessages.sort((a: any, b: any) => b.createdAt - a.createdAt)[0];
      return {
        ...conv,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
        } : null,
      };
    });
  }, [conversations, allMessages]);

  const getInitials = (visitorId: string) => {
    if (!visitorId) return "?";
    const parts = visitorId.split(/[-_]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return visitorId.substring(0, 2).toUpperCase();
  };

  const truncateMessage = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleViewChange = (viewString: string) => {
    const validViews: View[] = ["home", "inbox", "analytics", "knowledge", "orders", "issues", "settings"];
    if (validViews.includes(viewString as View)) {
      setView(viewString as View);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar
        selectedId={selectedId}
        onSelectConversation={setSelectedId}
        currentView={view}
        onViewChange={handleViewChange}
      />
      {view === "inbox" && !selectedId && (
        <InboxSidebar
          data={conversationsWithLastMessage || []}
          onRowClick={async (id) => {
            setSelectedId(id);
            await markOpened({ conversationId: id });
          }}
          getInitials={getInitials}
          truncateMessage={truncateMessage}
          formatTime={formatTime}
          isLoading={conversationsWithLastMessage === undefined}
          selectedId={selectedId}
        />
      )}
      {view === "knowledge" && (
        <KnowledgeSidebar
          data={knowledgeItems || []}
          onRowClick={(id) => {
            setSelectedId(id);
          }}
          isLoading={knowledgeItems === undefined}
          selectedId={selectedId}
          onAddClick={() => setAddDataSourceOpen(true)}
        />
      )}
      <AddDataSourceDialog
        open={addDataSourceOpen}
        onOpenChange={setAddDataSourceOpen}
      />
      <SidebarInset
        style={(view === "inbox" && !selectedId) || (view === "knowledge") ? {
          marginLeft: '20rem'
        } : undefined}
      >
        {view === "inbox" && !selectedId ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground text-sm">
                  Click on a conversation from the list to view the full message history and start chatting.
                </p>
              </div>
            </div>
          </div>
        ) : view === "knowledge" && !selectedId ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <h3 className="text-lg font-semibold mb-2">Select a document</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a document from the list to view its details, edit content, or manage settings.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-4">
                {selectedId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedId(null)}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="font-medium">
                  {selectedId && view === "knowledge"
                    ? "Preview"
                    : selectedId
                    ? `Conversation with ${conversations?.find((c: any) => c._id === selectedId)?.visitorId}`
                    : view === "home" ? "Home"
                    : view.charAt(0).toUpperCase() + view.slice(1)}
                </h2>
              </div>
            </header>

            <div className="flex flex-1 flex-col overflow-hidden">
              {view === "home" && !selectedId && <HomePage />}
              {view === "analytics" && !selectedId && <AnalyticsPage />}
              {view === "knowledge" && selectedId && knowledgeItems ? (
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {(() => {
                      const selectedItem = knowledgeItems.find((item: any) => item._id === selectedId);
                      if (!selectedItem) {
                        return (
                          <div className="text-center text-muted-foreground">
                            Document not found
                          </div>
                        );
                      }
                      const wordCount = editContent.trim() ? editContent.trim().split(/\s+/).length : 0;
                      const charCount = editContent.length;

                      const handleSave = async () => {
                        try {
                          await updateKnowledgeItem({
                            knowledgeId: selectedId,
                            title: editTitle,
                            description: editDescription.trim() || undefined,
                            content: editContent,
                          });
                          setIsEditingKnowledge(false);
                        } catch (error) {
                          console.error("Error updating knowledge item:", error);
                        }
                      };

                      const handleDelete = async () => {
                        try {
                          await deleteKnowledgeItem({ knowledgeId: selectedId });
                          setSelectedId(null);
                          setDeleteDialogOpen(false);
                        } catch (error) {
                          console.error("Error deleting knowledge item:", error);
                        }
                      };

                      return (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              {isEditingKnowledge ? (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                      id="edit-title"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      className="text-2xl font-bold"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <textarea
                                      id="edit-description"
                                      value={editDescription}
                                      onChange={(e) => setEditDescription(e.target.value)}
                                      className={cn(
                                        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        "resize-none"
                                      )}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h1 className="text-3xl font-bold">{selectedItem.title}</h1>
                                  {selectedItem.description && (
                                    <p className="text-muted-foreground text-lg">{selectedItem.description}</p>
                                  )}
                                </>
                              )}
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Type: {selectedItem.dataType}</span>
                                {selectedItem.createdAt && (
                                  <>
                                    <span>•</span>
                                    <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isEditingKnowledge ? (
                                <Button
                                  onClick={handleSave}
                                  className="bg-primary text-primary-foreground"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  onClick={() => setIsEditingKnowledge(true)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(true)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xl font-semibold">Content</h2>
                              <div className="text-sm text-muted-foreground">
                                {wordCount} words • {charCount} characters
                              </div>
                            </div>
                            {isEditingKnowledge ? (
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={cn(
                                  "flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  "resize-y"
                                )}
                                rows={20}
                              />
                            ) : (
                              <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm bg-muted p-4 rounded-lg overflow-x-auto text-black">
                                  {selectedItem.content}
                                </pre>
                              </div>
                            )}
                          </div>
                          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Document</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this document? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDelete}
                                  className="text-white"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      );
                    })()}
                  </div>
                </ScrollArea>
              ) : selectedId && view !== "knowledge" && (
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
              )}
              {view !== "home" && view !== "inbox" && view !== "knowledge" && view !== "analytics" && !selectedId && (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  {view.charAt(0).toUpperCase() + view.slice(1)} page coming soon
                </div>
              )}
            </div>
          </>
        )}
      </SidebarInset>
      {selectedId && view !== "knowledge" && (
        <UserSidebar
          selectedId={selectedId}
          conversations={conversations}
          onDeleteConversation={(id) => {
            setSelectedId(null)
          }}
        />
      )}
    </SidebarProvider>
  );
}