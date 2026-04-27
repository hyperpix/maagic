"use client"

import React from "react"
import { X, Trash2 } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WorkflowStep } from "./types"
import { STEP_DEF_MAP } from "./step-definitions"
import { STEP_ACCENT } from "./nodes/node-shared"

interface StepConfigProps {
  step: WorkflowStep
  onUpdateConfig: (config: Record<string, unknown>) => void
  onUpdateName: (name: string) => void
  onDelete?: () => void
  onClose: () => void
}

export function StepConfig({ step, onUpdateConfig, onUpdateName, onDelete, onClose }: StepConfigProps) {
  const def = STEP_DEF_MAP[step.type]
  const Icon = def?.icon
  const accent = STEP_ACCENT[step.type] ?? "#64748b"

  return (
    <div className="flex flex-col h-full">
      {/* Header — mirrors StepPicker header */}
      <div className="flex h-12 items-center gap-2 px-3 shrink-0 mt-3">
        {Icon && (
          <div
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            <Icon className="h-3 w-3" />
          </div>
        )}
        <input
          value={step.name}
          onChange={(e) => onUpdateName(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none truncate"
        />
        <button
          onClick={onClose}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Type label */}
      <p className="px-3 pb-2 text-[11px] text-sidebar-foreground/50">
        {def?.label ?? step.type}
      </p>

      {/* Config fields */}
      <div className="flex-1 overflow-y-auto">
        <ConfigFields step={step} onUpdate={onUpdateConfig} />
      </div>

      {/* Delete */}
      {onDelete && (
        <div className="shrink-0 border-t border-sidebar-border px-2 py-2">
          <button
            onClick={onDelete}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete step
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Field helpers ─────────────────────────────────────────────────────────── */

function SidebarInput({
  value,
  onChange,
  type = "text",
  min,
  max,
  step,
  placeholder,
}: {
  value: string | number
  onChange: (v: string) => void
  type?: string
  min?: number
  max?: number
  step?: number
  placeholder?: string
}) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-8 rounded-md border border-sidebar-border bg-muted px-2.5 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
    />
  )
}

function SidebarTextarea({
  value,
  onChange,
  rows = 4,
  placeholder,
  mono,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  mono?: boolean
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`w-full rounded-md border border-sidebar-border bg-muted px-2.5 py-2 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:ring-1 focus:ring-sidebar-ring resize-none ${mono ? "font-mono" : ""}`}
    />
  )
}

function SidebarSelect({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 border-sidebar-border bg-muted text-sidebar-foreground text-sm focus:ring-sidebar-ring">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  )
}

function ConfigGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="px-2 pb-1">{children}</div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

function ConfigRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 mb-3">
      <p className="text-xs font-medium text-sidebar-foreground/70">{label}</p>
      {hint && <p className="text-[11px] text-sidebar-foreground/40">{hint}</p>}
      {children}
    </div>
  )
}

/* ── Per-type config fields ─────────────────────────────────────────────────── */

function ConfigFields({ step, onUpdate }: { step: WorkflowStep; onUpdate: (cfg: Record<string, unknown>) => void }) {
  const cfg = step.config

  switch (step.type) {
    case "llm":
      return (
        <>
          <ConfigGroup label="Model">
            <ConfigRow label="Model">
              <SidebarSelect
                value={(cfg.model as string) || "gpt-4o-mini"}
                onValueChange={(v) => onUpdate({ model: v })}
              >
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-sonnet-4-6">Claude Sonnet</SelectItem>
                <SelectItem value="claude-haiku-4-5-20251001">Claude Haiku</SelectItem>
              </SidebarSelect>
            </ConfigRow>
            <div className="grid grid-cols-2 gap-2">
              <ConfigRow label="Temperature">
                <SidebarInput type="number" min={0} max={2} step={0.1} value={(cfg.temperature as number) ?? 0.7} onChange={(v) => onUpdate({ temperature: parseFloat(v) })} />
              </ConfigRow>
              <ConfigRow label="Max Tokens">
                <SidebarInput type="number" min={100} max={4096} value={(cfg.maxTokens as number) ?? 1024} onChange={(v) => onUpdate({ maxTokens: parseInt(v) })} />
              </ConfigRow>
            </div>
          </ConfigGroup>
          <ConfigGroup label="Prompt">
            <ConfigRow label="System Prompt">
              <SidebarTextarea rows={6} value={(cfg.systemPrompt as string) || ""} onChange={(v) => onUpdate({ systemPrompt: v })} placeholder="Override the system prompt…" />
            </ConfigRow>
          </ConfigGroup>
        </>
      )

    case "knowledge":
      return (
        <ConfigGroup label="Retrieval">
          <ConfigRow label="Max Results" hint="Number of chunks to retrieve">
            <SidebarInput type="number" min={1} max={10} value={(cfg.maxRetrieve as number) ?? 3} onChange={(v) => onUpdate({ maxRetrieve: parseInt(v) })} />
          </ConfigRow>
          <ConfigRow label="Min Similarity" hint="0–1, lower = more results">
            <SidebarInput type="number" min={0} max={1} step={0.05} value={(cfg.threshold as number) ?? 0.5} onChange={(v) => onUpdate({ threshold: parseFloat(v) })} />
          </ConfigRow>
        </ConfigGroup>
      )

    case "condition":
      return (
        <ConfigGroup label="Condition">
          <ConfigRow label="Expression" hint="e.g. confidence &lt; 0.6">
            <SidebarInput value={(cfg.expression as string) || ""} onChange={(v) => onUpdate({ expression: v })} placeholder="confidence < 0.6" />
          </ConfigRow>
        </ConfigGroup>
      )

    case "api":
      return (
        <ConfigGroup label="Request">
          <ConfigRow label="URL">
            <SidebarInput value={(cfg.url as string) || ""} onChange={(v) => onUpdate({ url: v })} placeholder="https://api.example.com/endpoint" />
          </ConfigRow>
          <ConfigRow label="Method">
            <SidebarSelect value={(cfg.method as string) || "GET"} onValueChange={(v) => onUpdate({ method: v })}>
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SidebarSelect>
          </ConfigRow>
          <ConfigRow label="Body (JSON)">
            <SidebarTextarea rows={4} value={(cfg.body as string) || ""} onChange={(v) => onUpdate({ body: v })} placeholder='{"key": "value"}' mono />
          </ConfigRow>
        </ConfigGroup>
      )

    case "email":
      return (
        <ConfigGroup label="Email">
          <ConfigRow label="To">
            <SidebarInput value={(cfg.to as string) || ""} onChange={(v) => onUpdate({ to: v })} placeholder="owner@example.com" />
          </ConfigRow>
          <ConfigRow label="Subject">
            <SidebarInput value={(cfg.subject as string) || ""} onChange={(v) => onUpdate({ subject: v })} placeholder="New support request" />
          </ConfigRow>
          <ConfigRow label="Body">
            <SidebarTextarea rows={5} value={(cfg.body as string) || ""} onChange={(v) => onUpdate({ body: v })} placeholder="Email content…" />
          </ConfigRow>
        </ConfigGroup>
      )

    case "delay":
      return (
        <ConfigGroup label="Timing">
          <div className="grid grid-cols-2 gap-2">
            <ConfigRow label="Duration">
              <SidebarInput type="number" min={1} value={(cfg.duration as number) ?? 5} onChange={(v) => onUpdate({ duration: parseInt(v) })} />
            </ConfigRow>
            <ConfigRow label="Unit">
              <SidebarSelect value={(cfg.unit as string) || "seconds"} onValueChange={(v) => onUpdate({ unit: v })}>
                <SelectItem value="seconds">Seconds</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SidebarSelect>
            </ConfigRow>
          </div>
        </ConfigGroup>
      )

    case "human_handoff":
      return (
        <ConfigGroup label="Handoff">
          <ConfigRow label="Message" hint="Shown to the human agent">
            <SidebarTextarea rows={4} value={(cfg.message as string) || ""} onChange={(v) => onUpdate({ message: v })} placeholder="This conversation needs human attention." />
          </ConfigRow>
        </ConfigGroup>
      )

    case "loop":
      return (
        <ConfigGroup label="Loop">
          <ConfigRow label="Max Iterations" hint="Safety limit">
            <SidebarInput type="number" min={1} max={100} value={(cfg.maxIterations as number) ?? 10} onChange={(v) => onUpdate({ maxIterations: parseInt(v) })} />
          </ConfigRow>
        </ConfigGroup>
      )

    default:
      return (
        <SidebarGroup>
          <p className="px-2 text-sm text-sidebar-foreground/50">No configuration for this step.</p>
        </SidebarGroup>
      )
  }
}
