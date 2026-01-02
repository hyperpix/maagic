"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface KnowledgeItem {
  _id: string
  title: string
  content?: string
  createdAt?: number
}

interface KnowledgeSidebarProps {
  data: KnowledgeItem[]
  onRowClick: (itemId: string) => void
  isLoading?: boolean
  selectedId?: string | null
  onAddClick?: () => void
}

export function KnowledgeSidebar({
  data,
  onRowClick,
  isLoading = false,
  selectedId = null,
  onAddClick,
}: KnowledgeSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data, searchQuery])

  return (
    <div 
      className="w-80 border-l bg-sidebar flex flex-col fixed inset-y-0 z-10 h-svh"
      style={{
        left: 'var(--sidebar-width, 16rem)'
      }}
    >
      <div className="p-2 shrink-0">
        <div className="px-2 mb-2 pt-4 flex items-center justify-between">
          <h2 className="font-medium">Knowledge base</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAddClick}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-2 mt-5">
          <Input
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <SidebarGroup>
          <SidebarGroupContent>
            {isLoading ? (
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <div className="flex items-start gap-3 px-2 py-2">
                      <div className="flex flex-col gap-1 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : filteredData.length === 0 ? (
              <div className="flex items-center justify-center h-full py-8">
                <div className="text-center text-muted-foreground text-sm">
                  {searchQuery ? "No items found" : "No knowledge base items yet"}
                </div>
              </div>
            ) : (
              <SidebarMenu>
                {filteredData.map((item, index) => {
                  const isSelected = selectedId === item._id
                  return (
                    <SidebarMenuItem key={item._id} className={index > 0 ? "border-t border-border/30" : ""}>
                      <SidebarMenuButton
                        onClick={() => onRowClick(item._id)}
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-3 h-auto",
                          isSelected && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {item.title}
                          </span>
                          {item.content && (
                            <div className="text-sm text-muted-foreground truncate">
                              {item.content.substring(0, 60)}
                              {item.content.length > 60 ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </ScrollArea>
    </div>
  )
}

