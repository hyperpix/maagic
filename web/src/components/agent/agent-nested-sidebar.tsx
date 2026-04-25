"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { AgentSidebarNav, AgentSection } from "./agent-sidebar-nav"

interface AgentNestedSidebarProps {
  viewMode: "prompt" | "canvas"
  onViewModeChange: (mode: "prompt" | "canvas") => void
  activeSection?: AgentSection
  onSectionChange?: (section: AgentSection) => void
}

export function AgentNestedSidebar({
  activeSection,
  onSectionChange,
}: AgentNestedSidebarProps) {
  return (
    <div className="w-56 border-l bg-sidebar flex flex-col flex-shrink-0 h-full">
      <div className="flex-1 min-h-0 overflow-y-auto pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeSection && onSectionChange && (
                <AgentSidebarNav
                  activeSection={activeSection}
                  onSectionChange={onSectionChange}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </div>
  )
}
