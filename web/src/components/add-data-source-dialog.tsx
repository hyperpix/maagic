"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

interface AddDataSourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddDataSourceDialog({ open, onOpenChange }: AddDataSourceDialogProps) {
  const [dataType, setDataType] = React.useState<"text" | "sitemap" | "file" | "url">("text")
  const [documentName, setDocumentName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [content, setContent] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const createKnowledgeItem = useMutation(api.knowledge.createKnowledgeItem)

  const handleSubmit = async () => {
    if (!documentName.trim() || !content.trim()) {
      return
    }
    
    setIsSubmitting(true)
    try {
      await createKnowledgeItem({
        title: documentName,
        description: description.trim() || undefined,
        content: content,
        dataType: dataType,
      })
      
      // Reset form
      setDataType("text")
      setDocumentName("")
      setDescription("")
      setContent("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating knowledge item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader className="pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl">Add a data source</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="space-y-6">
            {/* Data Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Data Type</Label>
              <Tabs value={dataType} onValueChange={(value) => setDataType(value as typeof dataType)} className="w-full">
                <TabsList className="!grid !w-full grid-cols-4 h-11">
                  <TabsTrigger value="text" className="text-sm">Text</TabsTrigger>
                  <TabsTrigger value="sitemap" className="text-sm" disabled>Sitemap</TabsTrigger>
                  <TabsTrigger value="file" className="text-sm" disabled>
                    File
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-sm" disabled>
                    URL
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="document-name" className="text-sm font-medium">
                  Document Name
                </Label>
                <Input
                  id="document-name"
                  placeholder="Enter document name"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Enter a brief description of the document"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  )}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  (Recommended) This description will help the LLM retrieve the context better.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Document Content
                </Label>
                <textarea
                  id="content"
                  placeholder="Enter or paste the document content here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={cn(
                    "flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  )}
                  rows={8}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[100px]"
            disabled={isSubmitting || !documentName.trim() || !content.trim()}
          >
            {isSubmitting ? "Adding..." : "Add Doc"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

