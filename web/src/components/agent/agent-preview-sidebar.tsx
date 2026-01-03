"use client"

import * as React from "react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { Thread } from "@/components/assistant-ui/thread"
import { useConvexRuntime } from "@/lib/use-chat-runtime"
import { AgentConfig } from "@/components/agent-page"

interface AgentPreviewSidebarProps extends React.ComponentProps<typeof Sidebar> {
  config: AgentConfig
}

export function AgentPreviewSidebar({
  config,
  ...props
}: AgentPreviewSidebarProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const { runtime, clearChat } = useConvexRuntime()

  return (
    <Sidebar variant="inset" side="right" className="w-[450px] h-full" {...props}>
      <SidebarHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-2 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
        </Tabs>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        {activeTab === "preview" && (
          <div className="flex-1 p-4">
            <AssistantRuntimeProvider runtime={runtime}>
              <Thread clearChat={clearChat} config={config} />
            </AssistantRuntimeProvider>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Quick Settings</h3>
                <p className="text-xs text-muted-foreground">
                  Additional configuration options will be available here.
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

