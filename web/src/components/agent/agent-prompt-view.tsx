"use client"

import { useState } from "react"
import { AgentSidebarNav, AgentSection } from "@/components/agent/agent-sidebar-nav"
import { AgentPreviewSidebar } from "@/components/agent/agent-preview-sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare,
  Brain,
  Settings,
  Info,
  Upload,
  Palette,
  Code,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AgentConfig } from "@/components/agent-page"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AgentPromptViewProps {
  config: AgentConfig
  onUpdateConfig: (updates: Partial<AgentConfig>) => void
  activeSection?: AgentSection
  onSectionChange?: (section: AgentSection) => void
}

export function AgentPromptView({ config, onUpdateConfig, activeSection: propActiveSection, onSectionChange: propOnSectionChange }: AgentPromptViewProps) {
  const [internalActiveSection, setInternalActiveSection] = useState<AgentSection>("instructions")
  const activeSection = propActiveSection ?? internalActiveSection
  const setActiveSection = propOnSectionChange ?? setInternalActiveSection

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
                  onChange={(e) => onUpdateConfig({ greetingMessage: e.target.value })}
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
                  onChange={(e) => onUpdateConfig({ baseInstructions: e.target.value })}
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
                  onValueChange={(val) => onUpdateConfig({ model: val })}
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
                    onChange={(e) => onUpdateConfig({ temperature: parseFloat(e.target.value) })}
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
                    onChange={(e) => onUpdateConfig({ maxTokens: parseInt(e.target.value) })}
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
                      onChange={(e) => onUpdateConfig({ title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={config.description} 
                      onChange={(e) => onUpdateConfig({ description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

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
                      onChange={(e) => onUpdateConfig({ logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>

              <Separator />

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
                        onChange={(e) => onUpdateConfig({ primaryColor: e.target.value })}
                      />
                      <Input 
                        value={config.primaryColor} 
                        onChange={(e) => onUpdateConfig({ primaryColor: e.target.value })}
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
                        onChange={(e) => onUpdateConfig({ backgroundColor: e.target.value })}
                      />
                      <Input 
                        value={config.backgroundColor} 
                        onChange={(e) => onUpdateConfig({ backgroundColor: e.target.value })}
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
                  onChange={(e) => onUpdateConfig({ privacyDisclaimer: e.target.value })}
                  placeholder="By chatting, you agree to our privacy policy..."
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </div>
          </div>
        )
      case "deployment":
        const embedUrl = typeof window !== 'undefined' ? window.location.origin : ''
        const embedCode = `<script src="${embedUrl}/widget.js" data-agent-id="primary" async></script>`
        const iframeCode = `<iframe src="${embedUrl}/chat" width="100%" height="600" frameborder="0"></iframe>`
        
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Embed Code</h2>
              <p className="text-sm text-muted-foreground">Copy and paste this code into your website to embed your agent</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Script Tag (Recommended)</Label>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground">Add this script to your website's {`<head>`} or before {`</body>`}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(embedCode)
                          toast.success("Code copied to clipboard!")
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <pre className="text-xs font-mono bg-background p-3 rounded border overflow-x-auto">
                      <code>{embedCode}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Iframe Embed</Label>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground">Embed as an iframe in your HTML</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(iframeCode)
                          toast.success("Code copied to clipboard!")
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <pre className="text-xs font-mono bg-background p-3 rounded border overflow-x-auto">
                      <code>{iframeCode}</code>
                    </pre>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Note:</strong> Make sure to replace the URL with your actual deployment URL when embedding on external websites.
                  </p>
                </div>
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
                    value={config.maxTokens || 3}
                    onChange={(e) => onUpdateConfig({ maxTokens: parseInt(e.target.value) })}
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
    <div className="flex-1 overflow-y-auto h-full">
      <div className="w-full p-6 min-h-full">
        {renderSection()}
      </div>
    </div>
  )
}

