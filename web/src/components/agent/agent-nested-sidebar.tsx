"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, GitBranch } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AgentSidebarNav, AgentSection } from "./agent-sidebar-nav"

interface AgentNestedSidebarProps {
  viewMode: "prompt" | "canvas"
  onViewModeChange: (mode: "prompt" | "canvas") => void
  activeSection?: AgentSection
  onSectionChange?: (section: AgentSection) => void
}

export function AgentNestedSidebar({
  viewMode,
  onViewModeChange,
  activeSection,
  onSectionChange,
}: AgentNestedSidebarProps) {
  return (
    <div className="w-64 border-l bg-sidebar flex flex-col flex-shrink-0 h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tabs
              value={viewMode}
              onValueChange={(v) => onViewModeChange(v as "prompt" | "canvas")}
              className="w-full"
            >
              <TabsList className="w-full">
                <TabsTrigger value="prompt" className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />
                  Prompt
                </TabsTrigger>
                <TabsTrigger value="canvas" className="flex-1 gap-2">
                  <GitBranch className="h-4 w-4" />
                  Canvas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {viewMode === "prompt" && activeSection && onSectionChange ? (
                <AgentSidebarNav
                  activeSection={activeSection}
                  onSectionChange={onSectionChange}
                />
              ) : viewMode === "canvas" ? (
                <div className="px-4 py-3 text-xs text-muted-foreground">
                  Use the <strong>+</strong> handles on the canvas to add steps. Click a node to configure it.
                </div>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </div>
  )
}
