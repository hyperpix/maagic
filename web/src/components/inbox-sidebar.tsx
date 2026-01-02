"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Conversation {
  _id: string
  visitorId: string
  createdAt: number
  openedAt?: number
  lastMessage: {
    content: string
    createdAt: number
  } | null
}

interface InboxSidebarProps {
  data: Conversation[]
  onRowClick: (conversationId: string) => void
  getInitials: (visitorId: string) => string
  truncateMessage: (text: string, maxLength?: number) => string
  formatTime: (timestamp: number) => string
  isLoading?: boolean
  selectedId?: string | null
}

export function InboxSidebar({
  data,
  onRowClick,
  getInitials,
  truncateMessage,
  formatTime,
  isLoading = false,
  selectedId = null,
}: InboxSidebarProps) {
  if (isLoading) {
    return (
      <div className="w-80 border-r bg-sidebar flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 px-2 py-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="w-80 border-r bg-sidebar flex flex-col">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground text-sm">
            No conversations yet
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-r bg-sidebar flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {data.map((conv) => {
            const isUnopened = !conv.openedAt
            const isSelected = selectedId === conv._id
            return (
              <button
                key={conv._id}
                onClick={() => onRowClick(conv._id)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-3 rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left",
                  isSelected && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src="" alt={conv.visitorId} />
                  <AvatarFallback className="text-sm">
                    {getInitials(conv.visitorId)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">
                      {conv.visitorId}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {conv.lastMessage
                          ? formatTime(conv.lastMessage.createdAt)
                          : formatTime(conv.createdAt)}
                      </span>
                      {isUnopened && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage
                      ? truncateMessage(conv.lastMessage.content)
                      : "No messages"}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

