"use client"

import { useState } from "react"
import { AgentCanvas } from "@/components/agent/agent-canvas"
import { AgentPromptView } from "@/components/agent/agent-prompt-view"
import { AgentNestedSidebar } from "@/components/agent/agent-nested-sidebar"
import { AgentSection } from "@/components/agent/agent-sidebar-nav"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useWorkspace } from "@/contexts/WorkspaceContext"

export type AgentConfig = {
  title?: string
  description?: string
  logoUrl?: string
  headerImage?: string
  backgroundImage?: string
  font?: string
  primaryColor?: string
  backgroundColor?: string
  enableTabs?: boolean
  privacyDisclaimer?: string
  legalLinks?: { label: string; url: string }[]
  // Behavior
  greetingMessage?: string
  baseInstructions?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

type ViewMode = "prompt" | "canvas"

export function AgentPage({ agentId }: { agentId?: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("prompt")
  const [activeSection, setActiveSection] = useState<AgentSection>("instructions")
  const { activeAgent } = useWorkspace()
  const updateConfigMutation = useMutation(api.agents.updateAgent)

  // Local state for real-time preview
  const [config, setConfig] = useState<AgentConfig>({
    title: "Support Bot",
    description: "Your virtual assistant",
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    baseInstructions: "Greet the user warmly and tell him that you are ready to help him.",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 2048,
  })

  const handleUpdateConfig = (updates: Partial<AgentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    if (!agentId) return
    try {
      await updateConfigMutation({ agentId: agentId as any, ...config })
      toast.success(`Agent ${viewMode === "prompt" ? "configuration" : "workflow"} saved successfully!`)
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save.")
    }
  }

  if (!agentId) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Nested Sidebar - Shared between prompt and canvas */}
      <AgentNestedSidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeSection={viewMode === "prompt" ? activeSection : undefined}
        onSectionChange={viewMode === "prompt" ? setActiveSection : undefined}
      />

      {/* Main Content */}
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Agent Configuration</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {viewMode === "prompt" 
                ? "Configure your agent with forms and prompts"
                : "Build your agent by connecting nodes on the canvas"}
            </p>
          </div>
          <Button onClick={handleSave} size="lg" className="px-8">
            Save Changes
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          {viewMode === "canvas" ? (
            <AgentCanvas />
          ) : (
            <AgentPromptView 
              config={config} 
              onUpdateConfig={handleUpdateConfig}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          )}
        </div>
      </div>
    </>
  )
}
