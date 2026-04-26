"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import {
  ChevronDown,
  ChevronRight,
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
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedId: string | null
  onSelectConversation: (id: string | null) => void
  currentView?: string
  onViewChange?: (view: string) => void
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
  agents: [
    { id: "agent-1", name: "Agent 1", email: "agent1@maagic.com" },
    { id: "agent-2", name: "Agent 2", email: "agent2@maagic.com" },
    { id: "agent-3", name: "Agent 3", email: "agent3@maagic.com" },
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
  currentView = "home",
  onViewChange,
  ...props
}: AdminSidebarProps) {
  const conversations = useQuery(api.conversations.getConversations)
  const [selectedOrg, setSelectedOrg] = useState(data.organizations[0])
  const [selectedAgent, setSelectedAgent] = useState(data.agents[0])
  const { isMobile } = useSidebar()

  const unopenedCount = conversations?.filter((conv: any) => !conv.openedAt).length || 0

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
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between bg-muted text-muted-foreground hover:bg-muted/80 border-sidebar-border">
                  <span className="text-sm font-medium">{selectedAgent.name}</span>
                  <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side={isMobile ? "bottom" : "right"}
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel>Agents</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {data.agents.map((agent) => (
                  <DropdownMenuItem
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">{agent.email}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // Handle add agent
                    console.log("Add agent")
                  }}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  <span>Add Agent</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "home" && !selectedId}
                onClick={() => {
                  onViewChange?.("home")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "inbox" && !selectedId}
                onClick={() => {
                  onViewChange?.("inbox")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Inbox
                {unopenedCount > 0 && (
                  <SidebarMenuBadge>{unopenedCount}</SidebarMenuBadge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "analytics"}
                onClick={() => {
                  onViewChange?.("analytics")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "knowledge"}
                onClick={() => {
                  onViewChange?.("knowledge")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Knowledge
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "agent-prompt" || currentView === "agent-canvas"}
                onClick={() => {
                  if (currentView !== "agent-prompt" && currentView !== "agent-canvas") {
                    onViewChange?.("agent-prompt")
                    onSelectConversation(null)
                  }
                }}
                className="w-full justify-start"
              >
                Agent
                <ChevronRight
                  className={`ml-auto size-4 transition-transform ${
                    currentView === "agent-prompt" || currentView === "agent-canvas" ? "rotate-90" : ""
                  }`}
                />
              </SidebarMenuButton>
              {(currentView === "agent-prompt" || currentView === "agent-canvas") && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={currentView === "agent-prompt"}
                      onClick={() => {
                        onViewChange?.("agent-prompt")
                        onSelectConversation(null)
                      }}
                    >
                      Prompt
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      isActive={currentView === "agent-canvas"}
                      onClick={() => {
                        onViewChange?.("agent-canvas")
                        onSelectConversation(null)
                      }}
                    >
                      Canvas
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "orders"}
                onClick={() => {
                  onViewChange?.("orders")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Orders
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "issues"}
                onClick={() => {
                  onViewChange?.("issues")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Issues
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={currentView === "settings"}
                onClick={() => {
                  onViewChange?.("settings")
                  onSelectConversation(null)
                }}
                className="w-full justify-start"
              >
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
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
