"use client"

import * as React from "react"
import { AgentSection } from "./agent-sidebar-nav"
import {
  MessageSquare,
  Brain,
  Zap,
  Database,
  Palette,
  ShieldCheck,
  Code,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface AgentNestedSidebarProps {
  viewMode: "prompt" | "canvas"
  onViewModeChange: (mode: "prompt" | "canvas") => void
  activeSection?: AgentSection
  onSectionChange?: (section: AgentSection) => void
}

const items: {
  id: AgentSection
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
}[] = [
  { id: "instructions", label: "Instructions",   icon: MessageSquare, accent: "#3b82f6" },
  { id: "llm",          label: "Model",           icon: Brain,         accent: "#8b5cf6" },
  { id: "tools",        label: "Tools & MCP",     icon: Zap,           accent: "#f97316" },
  { id: "knowledge",    label: "Knowledge Base",  icon: Database,      accent: "#f59e0b" },
  { id: "appearance",   label: "Appearance",      icon: Palette,       accent: "#f43f5e" },
  { id: "legal",        label: "Privacy & Legal", icon: ShieldCheck,   accent: "#64748b" },
  { id: "deployment",   label: "Embed",           icon: Code,          accent: "#06b6d4" },
]

export function AgentNestedSidebar({ activeSection, onSectionChange }: AgentNestedSidebarProps) {
  return (
    <div className="flex min-h-screen w-[16rem] shrink-0 flex-col bg-sidebar text-sidebar-foreground border-l border-sidebar-border">

      {/* Header — matches canvas right sidebar */}
      <div className="flex h-12 items-center gap-2 px-3 shrink-0 mt-3">
        <span className="flex-1 truncate text-sm font-semibold">Configuration</span>
      </div>

      {/* Nav items */}
      <SidebarGroup>
        <SidebarMenu>
          {items.map(({ id, label, icon: Icon, accent }) => (
            <SidebarMenuItem key={id}>
              <SidebarMenuButton
                isActive={activeSection === id}
                onClick={() => onSectionChange?.(id)}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                  style={{ backgroundColor: `${accent}20`, color: accent }}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}
