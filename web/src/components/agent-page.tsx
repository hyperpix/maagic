"use client"

import { useState, useEffect } from "react"
import { AgentLayout } from "@/components/agent/agent-layout"
import { AgentSidebarNav, AgentSection } from "@/components/agent/agent-sidebar-nav"
import { Thread } from "@/components/assistant-ui/thread"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useConvexRuntime } from "@/lib/use-chat-runtime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  FileText, 
  X,
  Info,
  MessageSquare,
  Brain,
  Zap,
  Database,
  Settings,
  Sparkles,
  Palette,
  ShieldCheck,
  Code,
  Upload
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Separator } from "@/components/ui/separator"

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

export function AgentPage() {
  const [activeSection, setActiveSection] = useState<AgentSection>("instructions")
  
  // Load existing config from Convex
  const savedConfig = useQuery(api.agentConfig.getAgentConfig)
  const updateConfigMutation = useMutation(api.agentConfig.updateAgentConfig)

  // Local state for real-time preview and unsaved changes
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
      toast.success("Agent configuration saved successfully!")
    } catch (error) {
      console.error("Failed to save config:", error)
      toast.error("Failed to save configuration.")
    }
  }

  const { runtime, clearChat } = useConvexRuntime();

  // Knowledge Base state (Separate for now as it's more complex)
  const [maxRetrieveBase, setMaxRetrieveBase] = useState("3")
  const [kbFilterTags, setKbFilterTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  if (savedConfig === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "instructions":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Behavior & Instructions</h2>
              <p className="text-sm text-muted-foreground">Define how your agent should act and respond</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium">Greeting Message</Label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The first message sent by the AI when a conversation starts
                </p>
                <Input
                  value={config.greetingMessage || ""}
                  onChange={(e) => handleUpdateConfig({ greetingMessage: e.target.value })}
                  placeholder="Hello! How can I help you today?"
                  className="max-w-2xl"
                />
              </div>

              <Separator className="max-w-2xl" />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium">Base Instructions</Label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Core instructions defining personality and behavior
                </p>
                <textarea
                  value={config.baseInstructions || ""}
                  onChange={(e) => handleUpdateConfig({ baseInstructions: e.target.value })}
                  placeholder="Greet the user warmly..."
                  rows={12}
                  className="flex w-full max-w-2xl rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </div>
          </div>
        )
      case "llm":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Model Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure the AI model powering your agent</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select 
                  value={config.model} 
                  onValueChange={(val) => handleUpdateConfig({ model: val })}
                >
                  <SelectTrigger id="model" className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => handleUpdateConfig({ temperature: parseFloat(e.target.value) })}
                    className="max-w-32"
                  />
                  <p className="text-xs text-muted-foreground">0 = focused, 2 = creative</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min="100"
                    max="4096"
                    value={config.maxTokens}
                    onChange={(e) => handleUpdateConfig({ maxTokens: parseInt(e.target.value) })}
                    className="max-w-32"
                  />
                  <p className="text-xs text-muted-foreground">Maximum response length</p>
                </div>
              </div>
            </div>
          </div>
        )
      case "appearance":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Appearance & Branding</h2>
              <p className="text-sm text-muted-foreground">Customize how your agent looks to visitors</p>
            </div>

            <div className="space-y-8 max-w-2xl">
              {/* Identity */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  Agent Identity
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={config.title} 
                      onChange={(e) => handleUpdateConfig({ title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={config.description} 
                      onChange={(e) => handleUpdateConfig({ description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Branding */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  Visual Assets
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input 
                      id="logo" 
                      value={config.logoUrl || ""} 
                      onChange={(e) => handleUpdateConfig({ logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Styling */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  Font & Colors
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="primary-color" 
                        type="color"
                        className="w-12 h-10 p-1"
                        value={config.primaryColor} 
                        onChange={(e) => handleUpdateConfig({ primaryColor: e.target.value })}
                      />
                      <Input 
                        value={config.primaryColor} 
                        onChange={(e) => handleUpdateConfig({ primaryColor: e.target.value })}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="bg-color" 
                        type="color"
                        className="w-12 h-10 p-1"
                        value={config.backgroundColor} 
                        onChange={(e) => handleUpdateConfig({ backgroundColor: e.target.value })}
                      />
                      <Input 
                        value={config.backgroundColor} 
                        onChange={(e) => handleUpdateConfig({ backgroundColor: e.target.value })}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "legal":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Privacy & Legal</h2>
              <p className="text-sm text-muted-foreground">Configure disclaimers and legal compliance</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy Disclaimer</Label>
                <textarea
                  id="privacy"
                  value={config.privacyDisclaimer || ""}
                  onChange={(e) => handleUpdateConfig({ privacyDisclaimer: e.target.value })}
                  placeholder="By chatting, you agree to our privacy policy..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </div>
          </div>
        )
      case "deployment":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Widget Code & Configuration</h2>
              <p className="text-sm text-muted-foreground">Generate and configure your widget integration code</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Embed Script</Label>
                    <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={() => {
                      const code = `<script src="${window.location.origin}/widget.js" data-agent-id="primary" async></script>`
                      navigator.clipboard.writeText(code)
                    }}>
                      <Code className="h-3 w-3" />
                      Copy Code
                    </Button>
                  </div>
                  <pre className="text-xs font-mono bg-background p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                    {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" data-agent-id="primary" async></script>`}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Note: Add this script tag to the {`<head>`} or the end of the {`<body>`} of your website.
                </p>
              </div>
            </div>
          </div>
        )
      case "knowledge":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground">Configure how your agent retrieves domain knowledge</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="max-retrieve-base">Max Retrieve Base</Label>
                  <Input
                    id="max-retrieve-base"
                    type="number"
                    min="1"
                    max="10"
                    value={maxRetrieveBase}
                    onChange={(e) => setMaxRetrieveBase(e.target.value)}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Max document chunks per query (~2000 chars each)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
            <Settings className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Coming Soon</p>
            <p className="text-sm">We're still building the {activeSection} section.</p>
          </div>
        )
    }
  }

  return (
    <AgentLayout
      sidebar={
        <AgentSidebarNav 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      }
      preview={
        <AssistantRuntimeProvider runtime={runtime}>
          <Thread clearChat={clearChat} config={config} />
        </AssistantRuntimeProvider>
      }
    >
      <div className="flex flex-col gap-8 w-full pt-6">
        <div className="flex items-center justify-between px-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Configuration</h1>
            <p className="text-muted-foreground mt-1">Manage behavior, knowledge, and appearance</p>
          </div>
          <Button onClick={handleSave} size="lg" className="px-8">
            Save Changes
          </Button>
        </div>

        <Separator />

        <div className="px-4 w-full">
          {renderSection()}
        </div>
      </div>
    </AgentLayout>
  )
}
