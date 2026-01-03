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
import { AgentCanvasNodePalette } from "./agent-canvas-node-palette"

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
    <div 
      className="w-80 border-l bg-sidebar flex flex-col fixed inset-y-0 z-10 h-svh"
      style={{
        left: 'var(--sidebar-width, 16rem)'
      }}
    >
      <div className="relative shrink-0">
        <div className="absolute top-0 left-0 right-0 p-2">
          <div className="px-2 mb-2 pt-4 flex items-center justify-between">
            <h2 className="font-medium">Agent</h2>
          </div>
        </div>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="h-14" />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as "prompt" | "canvas")} className="w-full">
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
      </div>
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
                <AgentCanvasNodePalette onAddNode={() => {}} />
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </div>
  )
}

