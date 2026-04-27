"use client"

import * as React from "react"
import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Globe,
  X,
  Plus,
  ShoppingCart,
  AlertCircle,
  Trash2,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { ComposerPrimitive } from "@assistant-ui/react"
import { useAdminRuntime } from "@/lib/use-admin-runtime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

interface UserSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedId: string | null
  conversations: any[] | undefined
  onDeleteConversation?: (conversationId: string) => void
}

export function UserSidebar({
  selectedId,
  conversations,
  onDeleteConversation,
  ...props
}: UserSidebarProps) {
  const runtime = useAdminRuntime(selectedId)
  const [activeTab, setActiveTab] = useState("contact")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteConversation = useMutation(api.conversations.deleteConversation)
  
  // Reset to contact tab when conversation changes
  React.useEffect(() => {
    if (selectedId) {
      setActiveTab("contact")
    }
  }, [selectedId])
  
  const handleDelete = async () => {
    if (!selectedId) return
    await deleteConversation({ conversationId: selectedId as any })
    onDeleteConversation?.(selectedId)
    setDeleteDialogOpen(false)
  }
  const [isEditing, setIsEditing] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [contactData, setContactData] = useState({
    name: "",
    channel: "Web",
    address: "",
    phone: "",
    email: "",
  })

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const selectedConversation = conversations?.find((c: any) => c._id === selectedId)
  const visitorId = selectedConversation?.visitorId || ""
  const conversationStartDate = selectedConversation?.createdAt
    ? new Date(selectedConversation.createdAt).toLocaleDateString()
    : "N/A"

  return (
    <Sidebar variant="inset" side="right" {...props}>
      <SidebarHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-2 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="contact" className="flex-1">Contact</TabsTrigger>
            <TabsTrigger value="copilot" className="flex-1">Copilot</TabsTrigger>
          </TabsList>
        </Tabs>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        {activeTab === "copilot" && (
          <>
            <div className="flex-1" />
            <div className="p-4">
              {selectedId ? (
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
              ) : (
                <div className="text-center text-muted-foreground text-xs py-4">
                  Select a conversation to reply
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === "contact" && (
          <div className="flex flex-col flex-1">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {selectedId ? (
                  <>
                    {/* Contact Information Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Contact Information</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground min-w-[80px]">Name/ID:</span>
                          {isEditing ? (
                            <Input
                              value={contactData.name}
                              onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                              className="h-7 text-xs"
                              placeholder="Enter name"
                            />
                          ) : (
                            <span>{contactData.name ? `${contactData.name} ${visitorId}` : visitorId}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground min-w-[80px]">Channel:</span>
                          {isEditing ? (
                            <Input
                              value={contactData.channel}
                              onChange={(e) => setContactData({ ...contactData, channel: e.target.value })}
                              className="h-7 text-xs"
                              placeholder="Enter channel"
                            />
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs font-medium">
                              <Globe className="h-3 w-3" />
                              <span>{contactData.channel || "Web"}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground min-w-[80px]">Started:</span>
                          <span>{conversationStartDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={contactData.phone}
                              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                              className="h-7 text-xs"
                              placeholder="Enter phone number"
                            />
                          ) : (
                            <span className="text-sm">{contactData.phone || "Not set"}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={contactData.email}
                              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                              className="h-7 text-xs"
                              placeholder="Enter email"
                            />
                          ) : (
                            <span className="text-sm">{contactData.email || "Not set"}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={contactData.address}
                              onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                              className="h-7 text-xs"
                              placeholder="Enter address"
                            />
                          ) : (
                            <span className="text-sm">{contactData.address || "Not set"}</span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-2 pt-4 border-t">
                      <h3 className="font-semibold text-sm">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                              aria-label={`Remove ${tag} tag`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag()
                            }
                          }}
                          placeholder="Add a tag..."
                          className="h-8 text-xs"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={addTag}
                          className="h-8 px-3"
                          variant="outline"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Select a conversation to view contact information
                  </div>
                )}
              </div>
            </ScrollArea>
            {selectedId && (
              <div className="p-4 space-y-2 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-9 font-medium hover:bg-accent/50 transition-colors"
                  size="sm"
                  onClick={() => console.log("Create Order")}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Create Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-9 font-medium hover:bg-accent/50 transition-colors"
                  size="sm"
                  onClick={() => console.log("Create Issue")}
                >
                  <AlertCircle className="h-4 w-4" />
                  Create Issue
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2 h-9 font-medium hover:bg-destructive/90 transition-colors text-white"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                  Delete Conversation
                </Button>
              </div>
            )}
          </div>
        )}
      </SidebarContent>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone and will permanently delete all messages in this conversation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="text-destructive-foreground"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}



