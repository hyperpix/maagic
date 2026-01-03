"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AgentLayoutProps {
  children: React.ReactNode
  preview: React.ReactNode
  sidebar?: React.ReactNode
}

export function AgentLayout({ children, preview, sidebar }: AgentLayoutProps) {
  return (
    <div className="flex flex-1 h-full overflow-hidden bg-background">
      {/* Settings Sidebar (Nested) - Only show if sidebar prop is provided */}
      {sidebar && (
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
                  <Button variant="outline" size="sm" className="w-full justify-between bg-muted text-muted-foreground hover:bg-muted/80 border-sidebar-border">
                    <span className="text-sm font-medium">Agent Settings</span>
                    <ChevronDown className="ml-2 size-4" />
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebar}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden h-full">
        {children}
      </div>

      {/* Preview Column (Fixed) */}
      <div className="w-[450px] border-l bg-yellow-100 flex flex-col items-center p-8 hidden xl:flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
          <div className="w-full aspect-[9/16] max-h-[750px] bg-background rounded-3xl border-8 border-muted/20 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col">
              {preview}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
