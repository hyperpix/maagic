"use client"

import { useState } from "react"
import { AgentLayout } from "@/components/agent/agent-layout"
import { AgentSidebarNav, AgentSection } from "@/components/agent/agent-sidebar-nav"
import { Thread } from "@/components/assistant-ui/thread"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import { useConvexRuntime } from "@/lib/use-chat-runtime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Sparkles
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
import { Separator } from "@/components/ui/separator"

export function AgentPage() {
  const [activeSection, setActiveSection] = useState<AgentSection>("instructions")
  
  // Instructions state
  const [greetingMessage, setGreetingMessage] = useState("")
  const [baseInstructions, setBaseInstructions] = useState("Greet the user warmly and tell him that you are ready to help him.")
  const [globalPrompts, setGlobalPrompts] = useState<string[]>([])

  // LLM state
  const [model, setModel] = useState("gpt-4o-mini")
  const [temperature, setTemperature] = useState("0.7")
  const [maxTokens, setMaxTokens] = useState("2048")
  const [fallbackModels, setFallbackModels] = useState<string[]>([])

  // Tools state
  const [tools, setTools] = useState<any[]>([])
  const [isPrestartToolOpen, setIsPrestartToolOpen] = useState(false)
  const [prestartUrl, setPrestartUrl] = useState("")
  const [prestartConvoId, setPrestartConvoId] = useState("")
  const [mcpServers, setMcpServers] = useState<any[]>([])

  // Knowledge Base state
  const [maxRetrieveBase, setMaxRetrieveBase] = useState("3")
  const [kbFilterTags, setKbFilterTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const { runtime, clearChat } = useConvexRuntime();

  const handleAddGlobalPrompt = () => {
    // Add logic to add global prompt
  }

  const handleAddTool = () => {
    // TODO: Implement add tool dialog
    console.log("Add tool")
  }

  const handleAddTag = () => {
    if (newTag.trim() && !kbFilterTags.includes(newTag.trim())) {
      setKbFilterTags([...kbFilterTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setKbFilterTags(kbFilterTags.filter(t => t !== tag))
  }

  const handleAddFallbackModel = (modelName: string) => {
    if (!fallbackModels.includes(modelName)) {
      setFallbackModels([...fallbackModels, modelName])
    }
  }

  const handleRemoveFallbackModel = (modelName: string) => {
    setFallbackModels(fallbackModels.filter(m => m !== modelName))
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
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  placeholder="Hello! How can I help you today?"
                  className="max-w-2xl"
                />
              </div>

              <Separator className="max-w-2xl" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base font-medium">Global Prompts</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reusable prompts applied across multiple agents
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddGlobalPrompt}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prompt
                  </Button>
                </div>
                {globalPrompts.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-6 border border-dashed rounded-lg max-w-2xl flex items-center justify-center bg-muted/20">
                    No global prompts assigned
                  </div>
                ) : (
                  <div className="space-y-2 max-w-2xl">
                    {globalPrompts.map((prompt, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md border">
                        <p className="text-sm">{prompt}</p>
                      </div>
                    ))}
                  </div>
                )}
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
                  value={baseInstructions}
                  onChange={(e) => setBaseInstructions(e.target.value)}
                  placeholder="Greet the user warmly and tell him that you are ready to help him."
                  rows={8}
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

            <div className="space-y-6">
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select value={model} onValueChange={setModel}>
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
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
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
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(e.target.value)}
                      className="max-w-32"
                    />
                    <p className="text-xs text-muted-foreground">Maximum response length</p>
                  </div>
                </div>
              </div>

              <Separator className="max-w-2xl" />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-medium">Fallback Models</Label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Backup models if the primary model is unavailable
                </p>
                <div className="space-y-4 max-w-2xl">
                  {fallbackModels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {fallbackModels.map((model) => (
                        <Badge key={model} variant="secondary" className="gap-2 py-1.5 px-3">
                          {model}
                          <button
                            type="button"
                            onClick={() => handleRemoveFallbackModel(model)}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Select onValueChange={handleAddFallbackModel}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Select a fallback model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )
      case "tools":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <h2 className="text-xl font-semibold mb-1">Tools & MCP</h2>
              <p className="text-sm text-muted-foreground">Connect external APIs and advanced integrations</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base font-medium">API Tools</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">External APIs your agent can call</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleAddTool}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tool
                  </Button>
                </div>
                {tools.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-8 border border-dashed rounded-lg max-w-2xl flex flex-col items-center justify-center bg-muted/20">
                    <Zap className="h-8 w-8 mb-2 opacity-50" />
                    <p>No tools configured</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-w-2xl">
                    {tools.map((tool) => (
                      <div key={tool.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-sm">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">{tool.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="max-w-2xl" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base font-medium">Prestart Tool</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Execute GET request before starting conversation</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPrestartToolOpen(true)}
                  >
                    Configure
                  </Button>
                </div>
              </div>

              <Separator className="max-w-2xl" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-base font-medium">MCP Servers</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Model Context Protocol integrations</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                {mcpServers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No MCP servers configured</p>
                ) : (
                  <div className="space-y-2 max-w-2xl">
                    {mcpServers.map((server) => (
                      <div key={server.id} className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">{server.name}</p>
                      </div>
                    ))}
                  </div>
                )}
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

                <Separator />

                <div className="space-y-3">
                  <Label>Filter Tags</Label>
                  {kbFilterTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No tags configured</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {kbFilterTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-2 py-1.5 px-3">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Enter tag name"
                      className="max-w-xs"
                    />
                    <Button size="sm" onClick={handleAddTag} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
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
          <Thread clearChat={clearChat} />
        </AssistantRuntimeProvider>
      }
    >
      {renderSection()}

      {/* Prestart Tool Dialog (Existing) */}
      <Dialog open={isPrestartToolOpen} onOpenChange={setIsPrestartToolOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Prestart Tool</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              Before starting a conversation node, a GET request will be sent to this URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prestart-url">URL</Label>
              <Input
                id="prestart-url"
                value={prestartUrl}
                onChange={(e) => setPrestartUrl(e.target.value)}
                placeholder="https://api.example.com/prestart"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrestartToolOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPrestartToolOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AgentLayout>
  )
}