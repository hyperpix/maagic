"use client"

import { useState } from "react"
import { AgentSection } from "@/components/agent/agent-sidebar-nav"
import { AgentConfig, McpServer } from "@/components/agent-page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Globe,
  Code2,
  FileText,
  ImageIcon,
  Mail,
  Calendar,
  Plus,
  Trash2,
  Server,
  Copy,
  Check,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

/* ─── StepCard — Tremor accordion look, always open, no toggle ──────────────── */

interface StepCardProps {
  title: string
  description: string
  children: React.ReactNode
}

function StepCard({ title, description, children }: StepCardProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
      {/* header — same padding/font as Tremor AccordionHeader, but plain div (no toggle) */}
      <div className="flex items-center px-4 py-3.5 bg-background">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>

      {/* body */}
      <div className="p-2 bg-background">
        <div className="rounded-lg bg-muted/50 px-4 py-4 ring-1 ring-inset ring-border space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── Field ─────────────────────────────────────────────────────────────────── */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground leading-snug">{hint}</p>}
      {children}
    </div>
  )
}

/* ─── Instructions ──────────────────────────────────────────────────────────── */

function InstructionsPage({ config, onUpdate }: { config: AgentConfig; onUpdate: (u: Partial<AgentConfig>) => void }) {
  return (
    <div className="space-y-3">
      <StepCard
        title="Greeting message"
        description="The first message sent when a visitor opens the chat."
      >
        <Input
          value={config.greetingMessage || ""}
          onChange={(e) => onUpdate({ greetingMessage: e.target.value })}
          placeholder="Hello! How can I help you today?"
        />
      </StepCard>

      <StepCard
        title="Base instructions"
        description="Defines your agent's personality, tone, and scope. Be specific — better instructions produce better responses."
      >
        <textarea
          value={config.baseInstructions || ""}
          onChange={(e) => onUpdate({ baseInstructions: e.target.value })}
          placeholder="You are a helpful support agent for Acme Inc. Always be polite and concise..."
          rows={8}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </StepCard>
    </div>
  )
}

/* ─── Model ─────────────────────────────────────────────────────────────────── */

const MODELS = [
  { value: "gpt-4o",        label: "GPT-4o",        note: "Most capable" },
  { value: "gpt-4o-mini",   label: "GPT-4o Mini",   note: "Fastest" },
  { value: "gpt-4-turbo",   label: "GPT-4 Turbo",   note: "" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", note: "Most affordable" },
]

function ModelPage({ config, onUpdate }: { config: AgentConfig; onUpdate: (u: Partial<AgentConfig>) => void }) {
  return (
    <div className="space-y-3">
      <StepCard
        title="Language model"
        description="The AI model that powers your agent's responses."
      >
        <Select value={config.model} onValueChange={(v) => onUpdate({ model: v })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                <span className="flex items-center gap-4">
                  <span>{m.label}</span>
                  {m.note && <span className="text-xs text-muted-foreground">{m.note}</span>}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StepCard>

      <StepCard
        title="Parameters"
        description="Fine-tune how the model generates responses."
      >
        <div className="grid grid-cols-2 gap-4">
          <Field label="Temperature" hint="0 = precise · 2 = creative">
            <Input
              type="number" min="0" max="2" step="0.1"
              value={config.temperature}
              onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
            />
          </Field>
          <Field label="Max tokens" hint="Maximum response length">
            <Input
              type="number" min="100" max="4096"
              value={config.maxTokens}
              onChange={(e) => onUpdate({ maxTokens: parseInt(e.target.value) })}
            />
          </Field>
        </div>
      </StepCard>
    </div>
  )
}

/* ─── Appearance ────────────────────────────────────────────────────────────── */

function AppearancePage({ config, onUpdate }: { config: AgentConfig; onUpdate: (u: Partial<AgentConfig>) => void }) {
  return (
    <div className="space-y-3">
      <StepCard
        title="Identity"
        description="Name and branding shown at the top of the chat widget."
      >
        <Field label="Title" hint="Name shown at the top of the chat widget.">
          <Input
            value={config.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Support Bot"
          />
        </Field>
        <Field label="Description" hint="Short tagline shown below the title.">
          <Input
            value={config.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Your virtual assistant"
          />
        </Field>
        <Field label="Logo URL" hint="Square PNG or SVG image recommended.">
          <Input
            value={config.logoUrl || ""}
            onChange={(e) => onUpdate({ logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </Field>
      </StepCard>

      <StepCard
        title="Brand colors"
        description="Customize the widget's primary and background colors."
      >
        {[
          { label: "Primary", hint: "Used for buttons, message bubbles, and the header.", key: "primaryColor" as const, fallback: "#3b82f6" },
          { label: "Background", hint: "Background of the chat widget.", key: "backgroundColor" as const, fallback: "#ffffff" },
        ].map(({ label, hint, key, fallback }) => (
          <Field key={key} label={label} hint={hint}>
            <div className="flex items-center gap-2.5">
              <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-input">
                <span className="block h-full w-full" style={{ backgroundColor: config[key] || fallback }} />
                <input
                  type="color"
                  value={config[key] || fallback}
                  onChange={(e) => onUpdate({ [key]: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              <Input
                value={config[key] || ""}
                onChange={(e) => onUpdate({ [key]: e.target.value })}
                className="w-32 font-mono text-sm"
                placeholder={fallback}
              />
            </div>
          </Field>
        ))}
      </StepCard>
    </div>
  )
}

/* ─── Legal ─────────────────────────────────────────────────────────────────── */

function LegalPage({ config, onUpdate }: { config: AgentConfig; onUpdate: (u: Partial<AgentConfig>) => void }) {
  return (
    <div className="space-y-3">
      <StepCard
        title="Privacy disclaimer"
        description="Shown to users before they start chatting. Keep it brief."
      >
        <textarea
          value={config.privacyDisclaimer || ""}
          onChange={(e) => onUpdate({ privacyDisclaimer: e.target.value })}
          placeholder="By chatting with this assistant, you agree to our privacy policy..."
          rows={5}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </StepCard>
    </div>
  )
}

/* ─── Knowledge ─────────────────────────────────────────────────────────────── */

function KnowledgePage({ config, onUpdate }: { config: AgentConfig; onUpdate: (u: Partial<AgentConfig>) => void }) {
  return (
    <div className="space-y-3">
      <StepCard
        title="Retrieval settings"
        description="Max document chunks fetched per query. Each chunk is ~2,000 characters."
      >
        <Field label="Max retrieve">
          <Input
            type="number" min="1" max="10"
            value={config.maxTokens || 3}
            onChange={(e) => onUpdate({ maxTokens: parseInt(e.target.value) })}
            className="w-24"
          />
        </Field>
      </StepCard>
    </div>
  )
}

/* ─── Deployment ────────────────────────────────────────────────────────────── */

function CopyBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={copy}>
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border bg-background px-4 py-3.5 text-xs font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function DeploymentPage() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://yourapp.com"
  return (
    <div className="space-y-3">
      <StepCard
        title="Script tag"
        description="Add this snippet to your site's head or before the closing body tag."
      >
        <CopyBlock
          label="Paste in your HTML"
          code={`<script\n  src="${origin}/widget.js"\n  data-agent-id="primary"\n  async\n></script>`}
        />
      </StepCard>

      <StepCard
        title="Iframe embed"
        description="Embed the chat interface directly in your page layout."
      >
        <CopyBlock
          label="Paste in your HTML"
          code={`<iframe\n  src="${origin}/chat"\n  width="100%"\n  height="600"\n  frameborder="0"\n></iframe>`}
        />
      </StepCard>
    </div>
  )
}

/* ─── Tools & MCP ───────────────────────────────────────────────────────────── */

const BUILTIN_TOOLS = [
  { id: "web_search",        label: "Web Search",        description: "Search the internet for up-to-date information.", icon: Globe },
  { id: "code_interpreter",  label: "Code Interpreter",  description: "Execute and analyse code during conversations.",  icon: Code2 },
  { id: "file_reader",       label: "File Reader",       description: "Read and summarise uploaded documents.",           icon: FileText },
  { id: "image_generation",  label: "Image Generation",  description: "Generate images from text descriptions.",          icon: ImageIcon },
  { id: "send_email",        label: "Send Email",        description: "Send emails on behalf of the user.",               icon: Mail },
  { id: "calendar",          label: "Calendar",          description: "Read and create calendar events.",                  icon: Calendar },
]

const EMPTY_SERVER: Omit<McpServer, "id"> = { name: "", url: "", transport: "sse" }

function ToolsPage({ config, onUpdate }: { config: AgentConfig; onUpdate: (u: Partial<AgentConfig>) => void }) {
  const enabledTools = config.enabledTools ?? []
  const mcpServers   = config.mcpServers   ?? []

  const [adding, setAdding] = useState(false)
  const [draft, setDraft]   = useState<Omit<McpServer, "id">>(EMPTY_SERVER)

  const toggleTool = (id: string) => {
    const next = enabledTools.includes(id)
      ? enabledTools.filter((t) => t !== id)
      : [...enabledTools, id]
    onUpdate({ enabledTools: next })
  }

  const addServer = () => {
    if (!draft.name.trim() || !draft.url.trim()) return
    const server: McpServer = { ...draft, id: crypto.randomUUID() }
    onUpdate({ mcpServers: [...mcpServers, server] })
    setDraft(EMPTY_SERVER)
    setAdding(false)
    toast.success("MCP server added")
  }

  const removeServer = (id: string) => {
    onUpdate({ mcpServers: mcpServers.filter((s) => s.id !== id) })
  }

  return (
    <div className="space-y-3">
      {/* Built-in tools */}
      <StepCard title="Built-in tools" description="Toggle capabilities the agent can use during a conversation.">
        <div className="space-y-1">
          {BUILTIN_TOOLS.map(({ id, label, description, icon: Icon }) => (
            <div key={id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/60 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted border border-border">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">{description}</p>
                </div>
              </div>
              <Switch
                checked={enabledTools.includes(id)}
                onCheckedChange={() => toggleTool(id)}
                className="shrink-0"
              />
            </div>
          ))}
        </div>
      </StepCard>

      {/* MCP Servers */}
      <StepCard title="MCP servers" description="Connect Model Context Protocol servers to give your agent custom tools.">
        <div className="space-y-2">
          {mcpServers.length === 0 && !adding && (
            <div className="flex flex-col items-center gap-1.5 py-6 text-center">
              <Server className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No MCP servers connected yet.</p>
            </div>
          )}

          {/* existing servers */}
          {mcpServers.map((server) => (
            <div key={server.id} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted border border-border">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{server.name}</p>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">{server.transport.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{server.url}</p>
              </div>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeServer(server.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}

          {/* add form */}
          {adding && (
            <div className="rounded-lg border border-border bg-background px-3 py-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="My MCP Server"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Transport</Label>
                  <Select value={draft.transport} onValueChange={(v) => setDraft((d) => ({ ...d, transport: v as McpServer["transport"] }))}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sse">SSE</SelectItem>
                      <SelectItem value="stdio">stdio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  {draft.transport === "sse" ? "Server URL" : "Command"}
                </Label>
                <Input
                  value={draft.url}
                  onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                  placeholder={draft.transport === "sse" ? "https://my-mcp-server.com/sse" : "npx my-mcp-server"}
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setAdding(false); setDraft(EMPTY_SERVER) }}>
                  Cancel
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={addServer} disabled={!draft.name.trim() || !draft.url.trim()}>
                  Add server
                </Button>
              </div>
            </div>
          )}

          {!adding && (
            <Button variant="outline" size="sm" className="w-full h-8 gap-1.5 text-xs" onClick={() => setAdding(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add MCP server
            </Button>
          )}
        </div>
      </StepCard>
    </div>
  )
}


/* ─── root ──────────────────────────────────────────────────────────────────── */

interface AgentPromptViewProps {
  config: AgentConfig
  onUpdateConfig: (updates: Partial<AgentConfig>) => void
  activeSection?: AgentSection
  onSectionChange?: (section: AgentSection) => void
}

const SECTION_TITLES: Record<string, string> = {
  instructions: "Instructions",
  llm: "Model",
  tools: "Tools & MCP",
  knowledge: "Knowledge Base",
  appearance: "Appearance",
  legal: "Privacy & Legal",
  deployment: "Embed",
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  instructions: "Configure how your agent greets and responds to users.",
  llm: "Choose the AI model and tune generation parameters.",
  appearance: "Customize how your agent looks to visitors.",
  legal: "Manage disclaimers and legal notices.",
  knowledge: "Configure how your agent retrieves information.",
  deployment: "Add your agent to any website in minutes.",
  tools: "Connect tools and MCP servers.",
}

export function AgentPromptView({ config, onUpdateConfig, activeSection: propSection }: AgentPromptViewProps) {
  const [fallback] = useState<AgentSection>("instructions")
  const section = propSection ?? fallback

  return (
    <div className="flex-1 overflow-y-auto h-full">
      <div className="sm:mx-auto sm:max-w-lg px-6 py-10">
        <h3 className="text-lg font-semibold text-foreground">
          {SECTION_TITLES[section] ?? section}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {SECTION_DESCRIPTIONS[section] ?? ""}
        </p>
        <div className="mt-6">
          {section === "instructions" && <InstructionsPage config={config} onUpdate={onUpdateConfig} />}
          {section === "llm"          && <ModelPage        config={config} onUpdate={onUpdateConfig} />}
          {section === "appearance"   && <AppearancePage   config={config} onUpdate={onUpdateConfig} />}
          {section === "legal"        && <LegalPage        config={config} onUpdate={onUpdateConfig} />}
          {section === "knowledge"    && <KnowledgePage    config={config} onUpdate={onUpdateConfig} />}
          {section === "deployment"   && <DeploymentPage />}
          {section === "tools"        && <ToolsPage        config={config} onUpdate={onUpdateConfig} />}
        </div>
      </div>
    </div>
  )
}
