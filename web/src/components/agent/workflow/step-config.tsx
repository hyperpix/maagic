"use client"

import React from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WorkflowStep, WorkflowBranch } from "./types"
import { STEP_DEF_MAP } from "./step-definitions"

interface StepConfigProps {
  step: WorkflowStep
  onUpdateConfig: (config: Record<string, unknown>) => void
  onUpdateName: (name: string) => void
  onClose: () => void
}

export function StepConfig({ step, onUpdateConfig, onUpdateName, onClose }: StepConfigProps) {
  const def = STEP_DEF_MAP[step.type]
  const Icon = def?.icon

  return (
    <div className="w-80 border-l bg-sidebar flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
            {def?.label ?? step.type}
          </div>
          <Input
            value={step.name}
            onChange={(e) => onUpdateName(e.target.value)}
            className="h-6 px-0 border-none bg-transparent text-sm font-semibold focus-visible:ring-0 p-0"
          />
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <ConfigFields step={step} onUpdate={onUpdateConfig} />
        </div>
      </ScrollArea>
    </div>
  )
}

function ConfigFields({
  step,
  onUpdate,
}: {
  step: WorkflowStep
  onUpdate: (cfg: Record<string, unknown>) => void
}) {
  const cfg = step.config

  switch (step.type) {
    case "llm":
      return (
        <>
          <Field label="Model">
            <Select
              value={(cfg.model as string) || "gpt-4o-mini"}
              onValueChange={(v) => onUpdate({ model: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="claude-sonnet-4-6">Claude Sonnet</SelectItem>
                <SelectItem value="claude-haiku-4-5-20251001">Claude Haiku</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Temperature">
              <Input
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={(cfg.temperature as number) ?? 0.7}
                onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
              />
            </Field>
            <Field label="Max Tokens">
              <Input
                type="number"
                min={100}
                max={4096}
                value={(cfg.maxTokens as number) ?? 1024}
                onChange={(e) => onUpdate({ maxTokens: parseInt(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="System Prompt">
            <textarea
              value={(cfg.systemPrompt as string) || ""}
              onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
              rows={6}
              placeholder="Override the system prompt for this step…"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </Field>
        </>
      )

    case "knowledge":
      return (
        <>
          <Field label="Max Retrieve" hint="Number of document chunks to retrieve">
            <Input
              type="number"
              min={1}
              max={10}
              value={(cfg.maxRetrieve as number) ?? 3}
              onChange={(e) => onUpdate({ maxRetrieve: parseInt(e.target.value) })}
            />
          </Field>
          <Field label="Min Similarity" hint="0–1, lower = more results">
            <Input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={(cfg.threshold as number) ?? 0.5}
              onChange={(e) => onUpdate({ threshold: parseFloat(e.target.value) })}
            />
          </Field>
        </>
      )

    case "condition":
      return (
        <Field label="Condition Expression" hint="e.g. confidence < 0.6">
          <Input
            value={(cfg.expression as string) || ""}
            onChange={(e) => onUpdate({ expression: e.target.value })}
            placeholder="confidence < 0.6"
          />
        </Field>
      )

    case "api":
      return (
        <>
          <Field label="URL">
            <Input
              value={(cfg.url as string) || ""}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="https://api.example.com/endpoint"
            />
          </Field>
          <Field label="Method">
            <Select
              value={(cfg.method as string) || "GET"}
              onValueChange={(v) => onUpdate({ method: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Request Body (JSON)">
            <textarea
              value={(cfg.body as string) || ""}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={4}
              placeholder='{"key": "value"}'
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </Field>
        </>
      )

    case "email":
      return (
        <>
          <Field label="To">
            <Input
              value={(cfg.to as string) || ""}
              onChange={(e) => onUpdate({ to: e.target.value })}
              placeholder="owner@example.com"
            />
          </Field>
          <Field label="Subject">
            <Input
              value={(cfg.subject as string) || ""}
              onChange={(e) => onUpdate({ subject: e.target.value })}
              placeholder="New support request"
            />
          </Field>
          <Field label="Body">
            <textarea
              value={(cfg.body as string) || ""}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={5}
              placeholder="Email content…"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </Field>
        </>
      )

    case "delay":
      return (
        <div className="flex gap-3">
          <Field label="Duration">
            <Input
              type="number"
              min={1}
              value={(cfg.duration as number) ?? 5}
              onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
            />
          </Field>
          <Field label="Unit">
            <Select
              value={(cfg.unit as string) || "seconds"}
              onValueChange={(v) => onUpdate({ unit: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seconds">Seconds</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      )

    case "human_handoff":
      return (
        <Field label="Handoff Message" hint="Shown to the human agent">
          <textarea
            value={(cfg.message as string) || ""}
            onChange={(e) => onUpdate({ message: e.target.value })}
            rows={4}
            placeholder="This conversation needs human attention."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </Field>
      )

    case "loop":
      return (
        <Field label="Max Iterations" hint="Safety limit">
          <Input
            type="number"
            min={1}
            max={100}
            value={(cfg.maxIterations as number) ?? 10}
            onChange={(e) => onUpdate({ maxIterations: parseInt(e.target.value) })}
          />
        </Field>
      )

    default:
      return (
        <p className="text-sm text-muted-foreground">No configuration for this step.</p>
      )
  }
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {children}
    </div>
  )
}
