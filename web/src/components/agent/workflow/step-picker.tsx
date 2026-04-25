"use client"

import React, { useState } from "react"
import { X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { STEP_DEFINITIONS } from "./step-definitions"
import type { StepType } from "./types"

interface StepPickerProps {
  onSelect: (type: StepType) => void
  onClose: () => void
}

export function StepPicker({ onSelect, onClose }: StepPickerProps) {
  const [query, setQuery] = useState("")

  const filtered = STEP_DEFINITIONS.filter(
    (d) =>
      d.label.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
  )

  const triggers = filtered.filter((d) => d.category === "triggers")
  const actions = filtered.filter((d) => d.category === "actions")

  return (
    <div className="w-72 border-l bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm">Add Step</h3>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search steps…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Step list */}
      <div className="flex-1 overflow-y-auto py-2">
        {triggers.length > 0 && (
          <Section title="Triggers" items={triggers} onSelect={onSelect} />
        )}
        {actions.length > 0 && (
          <Section title="Actions" items={actions} onSelect={onSelect} />
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No steps match "{query}"
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  items,
  onSelect,
}: {
  title: string
  items: typeof STEP_DEFINITIONS
  onSelect: (type: StepType) => void
}) {
  return (
    <div className="mb-4">
      <div className="px-4 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </div>
      {items.map((def) => {
        const Icon = def.icon
        return (
          <button
            key={def.type}
            onClick={() => onSelect(def.type)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left group"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted group-hover:bg-background border border-transparent group-hover:border-border flex items-center justify-center transition-all">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-tight">{def.label}</div>
              <div className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                {def.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
