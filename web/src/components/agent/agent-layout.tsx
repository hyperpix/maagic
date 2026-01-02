"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AgentLayoutProps {
  children: React.ReactNode
  preview: React.ReactNode
  sidebar: React.ReactNode
}

export function AgentLayout({ children, preview, sidebar }: AgentLayoutProps) {
  return (
    <div className="flex flex-1 h-full overflow-hidden bg-background">
      {/* Settings Sidebar (Vertical Nav) */}
      <div className="w-64 border-r flex flex-col bg-muted/5">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm px-2">Agent Settings</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {sidebar}
        </nav>
      </div>

      {/* Main Content Area (Scrollable Forms) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 pb-32">
          {children}
        </div>
      </div>

      {/* Preview Column (Fixed) */}
      <div className="w-[450px] border-l bg-muted/10 flex flex-col items-center p-8 hidden xl:flex">
        <div className="sticky top-8 w-full flex flex-col items-center">
          <div className="w-full aspect-[9/16] max-h-[750px] bg-background rounded-3xl shadow-2xl border-8 border-muted/20 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col">
              {preview}
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">Interactive Preview</p>
            <p className="text-xs text-muted-foreground">Changes are reflected in real-time</p>
          </div>
        </div>
      </div>
    </div>
  )
}
