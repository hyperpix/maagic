"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import {
  ChevronDown,
  ChevronsUpDown,
  LifeBuoy,
  LogOut,
  Plus,
  Send,
} from "lucide-react"
import { api } from "../../convex/_generated/api"
import { useQuery } from "convex/react"
import { NavSecondary } from "@/components/nav-secondary"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

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
  organizations: [
    { id: "org-1", name: "Acme Inc", description: "Enterprise" },
    { id: "org-2", name: "TechCorp", description: "Startup" },
    { id: "org-3", name: "Global Solutions", description: "Business" },
  ],
  user: {
    name: "Sokhina",
    email: "sokhina@maagic.com",
    avatar: "",
  },
}

export function AdminSidebar({
  selectedId,
  onSelectConversation,
  ...props
}: AdminSidebarProps) {
  const conversations = useQuery(api.conversations.getConversations)
  const [selectedOrg, setSelectedOrg] = useState(data.organizations[0])
  const { isMobile } = useSidebar()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                    <Image
                      src="/maagic-logo.png"
                      alt="Maagic Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{selectedOrg.name}</span>
                    <span className="truncate text-xs">{selectedOrg.description}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side={isMobile ? "bottom" : "right"}
                align="start"
                sideOffset={4}
              >
                {data.organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => setSelectedOrg(org)}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span className="font-medium">{org.name}</span>
                    <span className="text-xs text-muted-foreground">{org.description}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // Handle add organization
                    console.log("Add organization")
                  }}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  <span>Add Organization</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">
                      {data.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{data.user.name}</span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">
                        {data.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Log out")}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
