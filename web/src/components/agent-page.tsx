"use client"

import { useState, useEffect } from "react"
import { WorkflowCanvas } from "@/components/agent/workflow/WorkflowCanvas"
import { AgentPromptView } from "@/components/agent/agent-prompt-view"
import { AgentSection } from "@/components/agent/agent-sidebar-nav"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export type McpServer = {
  id: string
  name: string
  url: string
  transport: "sse" | "stdio"
}

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
  greetingMessage?: string
  baseInstructions?: string
  model?: string
  temperature?: number
  maxTokens?: number
  enabledTools?: string[]
  mcpServers?: McpServer[]
}

const SECTION_LABELS: Record<AgentSection, string> = {
  instructions: "Instructions",
  llm: "Model",
  tools: "Tools",
  knowledge: "Knowledge",
  appearance: "Appearance",
  legal: "Privacy & Legal",
  deployment: "Embed",
}

interface AgentPageProps {
  viewMode?: "prompt" | "canvas"
  activeSection?: AgentSection
  onSectionChange?: (section: AgentSection) => void
}

export function AgentPage({ viewMode = "prompt", activeSection: activeSectionProp, onSectionChange }: AgentPageProps) {
  const [activeSectionLocal, setActiveSectionLocal] = useState<AgentSection>("instructions")
  const activeSection = activeSectionProp ?? activeSectionLocal
  const setActiveSection = onSectionChange ?? setActiveSectionLocal

  const savedConfig = useQuery(api.agentConfig.getAgentConfig)
  const updateConfigMutation = useMutation(api.agentConfig.updateAgentConfig)

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

  useEffect(() => {
    if (savedConfig) {
      setConfig(prev => ({ ...prev, ...savedConfig }))
    }
  }, [savedConfig])

  const handleUpdateConfig = (updates: Partial<AgentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    try {
      await updateConfigMutation(config)
      toast.success("Saved")
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save.")
    }
  }

  if (savedConfig === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    )
  }

  const headerLabel =
    viewMode === "canvas"
      ? "Workflow"
      : SECTION_LABELS[activeSection] ?? activeSection

  if (viewMode === "canvas") {
    return <WorkflowCanvas />
  }

  return (
    <div className="flex h-full w-full">
      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 h-full">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <h2 className="font-medium">Agent</h2>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground font-medium">{headerLabel}</span>
          <div className="ml-auto">
            <Button onClick={handleSave} variant="yellow" size="sm">Save</Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          <AgentPromptView
            config={config}
            onUpdateConfig={handleUpdateConfig}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>
    </div>
  )
}

