"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  MessageSquare, 
  Brain, 
  Zap, 
  Database, 
  Palette, 
  ShieldCheck, 
  Code 
} from "lucide-react"
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export type AgentSection = 
  | "instructions" 
  | "llm" 
  | "tools" 
  | "knowledge" 
  | "appearance" 
  | "legal" 
  | "deployment"

interface AgentSidebarNavProps {
  activeSection: AgentSection
  onSectionChange: (section: AgentSection) => void
}

const items: { id: AgentSection; label: string; icon: any }[] = [
  { id: "instructions", label: "Instructions", icon: MessageSquare },
  { id: "llm", label: "Model Configuration", icon: Brain },
  { id: "tools", label: "Tools & MCP", icon: Zap },
  { id: "knowledge", label: "Knowledge Base", icon: Database },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "legal", label: "Privacy & Legal", icon: ShieldCheck },
  { id: "deployment", label: "Deployment", icon: Code },
]

export function AgentSidebarNav({ activeSection, onSectionChange }: AgentSidebarNavProps) {
  return (
    <>
      {items.map((item) => {
        return (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              isActive={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
              className="w-full justify-start"
            >
              {item.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}
