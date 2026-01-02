"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Brain, 
  Zap, 
  Database, 
  Palette, 
  ShieldCheck, 
  Code 
} from "lucide-react"

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
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-3 px-3 py-2 h-10",
              activeSection === item.id 
                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => onSectionChange(item.id)}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{item.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
