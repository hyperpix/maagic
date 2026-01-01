"use client"

import * as React from "react"
import {
  Command,
  LifeBuoy,
  Send,
} from "lucide-react"
import { api } from "../../convex/_generated/api"
import { useQuery } from "convex/react"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedId: string | null
  onSelectConversation: (id: string) => void
}

const data = {
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AdminSidebar({
  selectedId,
  onSelectConversation,
  ...props
}: AdminSidebarProps) {
  const conversations = useQuery(api.conversations.getConversations)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Admin Inbox</span>
                  <span className="truncate text-xs">Conversations</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarMenu>
            {conversations === undefined ? (
              <SidebarMenuItem>
                <div className="px-2 py-1.5 text-center text-muted-foreground text-sm">
                  Loading conversations...
                </div>
              </SidebarMenuItem>
            ) : conversations.length === 0 ? (
              <SidebarMenuItem>
                <div className="px-2 py-1.5 text-center text-muted-foreground text-sm">
                  No conversations yet
                </div>
              </SidebarMenuItem>
            ) : (
              conversations.map((conv: any) => (
                <SidebarMenuItem key={conv._id}>
                  <SidebarMenuButton
                    isActive={selectedId === conv._id}
                    tooltip={conv.visitorId}
                    onClick={() => onSelectConversation(conv._id)}
                    className="flex flex-col items-start gap-0.5 h-auto py-2"
                  >
                    <span className="truncate text-sm font-medium w-full">
                      {conv.visitorId}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {new Date(conv.createdAt).toLocaleString()}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
