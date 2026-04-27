"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KnowledgeSidebar } from "@/components/knowledge-sidebar";
import { AddDataSourceDialog } from "@/components/add-data-source-dialog";

export function KnowledgeView({ agentId }: { agentId: Id<"agents"> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addDataSourceOpen, setAddDataSourceOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const knowledgeItems = useQuery(api.knowledge.getKnowledgeItems, { agentId });
  const updateKnowledgeItem = useMutation(api.knowledge.updateKnowledgeItem);
  const deleteKnowledgeItem = useMutation(api.knowledge.deleteKnowledgeItem);

  const selectedItem = knowledgeItems?.find((item: any) => item._id === selectedId);

  useEffect(() => {
    if (selectedItem && !isEditing) {
      setEditTitle(selectedItem.title);
      setEditDescription(selectedItem.description ?? "");
      setEditContent(selectedItem.content);
    }
  }, [selectedItem, isEditing]);

  const handleSave = async () => {
    if (!selectedId) return;
    await updateKnowledgeItem({
      knowledgeId: selectedId as any,
      title: editTitle,
      description: editDescription.trim() || undefined,
      content: editContent,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await deleteKnowledgeItem({ knowledgeId: selectedId as any });
    setSelectedId(null);
    setDeleteDialogOpen(false);
  };

  const wordCount = editContent.trim() ? editContent.trim().split(/\s+/).length : 0;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-80 border-r flex-shrink-0 flex flex-col h-full">
        <KnowledgeSidebar
          data={knowledgeItems ?? []}
          onRowClick={(id) => { setSelectedId(id); setIsEditing(false); }}
          isLoading={knowledgeItems === undefined}
          selectedId={selectedId}
          onAddClick={() => setAddDataSourceOpen(true)}
        />
      </div>

      <AddDataSourceDialog
        open={addDataSourceOpen}
        onOpenChange={setAddDataSourceOpen}
        agentId={agentId}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold mb-2">Select a document</h3>
              <p className="text-muted-foreground text-sm">
                Choose a document to view details or edit content.
              </p>
            </div>
          </div>
        ) : !selectedItem ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Document not found
          </div>
        ) : (
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <textarea
                          id="edit-description"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className={cn(
                            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    <span>•</span>
                    <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />Save
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(true)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Content</h2>
                  <p className="text-sm text-muted-foreground">{wordCount} words • {editContent.length} chars</p>
                </div>
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={cn(
                      "flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                    rows={20}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    {selectedItem.content}
                  </pre>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>Are you sure? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
