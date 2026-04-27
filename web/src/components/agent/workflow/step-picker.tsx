"use client"

import React, { useState } from "react"
import { Search, X, GitFork } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { STEP_DEFINITIONS } from "./step-definitions"
import { STEP_ACCENT } from "./nodes/node-shared"
import type { StepType } from "./types"

interface StepPickerProps {
  onSelect: (type: StepType) => void
  onAddBranch?: () => void
  onClose: () => void
}

export function StepPicker({ onSelect, onAddBranch, onClose }: StepPickerProps) {
  const [query, setQuery] = useState("")

  const filtered = STEP_DEFINITIONS.filter(
    (d) =>
      d.category !== "triggers" &&
      (d.label.toLowerCase().includes(query.toLowerCase()) ||
        d.description.toLowerCase().includes(query.toLowerCase()))
  )

  const dataItems = filtered.filter((d) => d.category === "data")
  const flowItems = filtered.filter((d) => d.category === "flow" && d.type !== "branch")
  const showBranch =
    !query ||
    "branch".includes(query.toLowerCase()) ||
    "split".includes(query.toLowerCase())

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex h-12 items-center gap-2 px-3 shrink-0 mt-3">
        <span className="flex-1 truncate text-sm font-semibold">Add Step</span>
        <button
          onClick={onClose}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search */}
      <div className="px-2 pb-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            autoFocus
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-8 rounded-md border border-sidebar-border bg-muted pl-8 pr-7 text-sm font-medium text-muted-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Step list */}
      <div className="flex-1 overflow-y-auto">
        {dataItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Data</SidebarGroupLabel>
            <SidebarMenu>
              {dataItems.map((def) => (
                <StepMenuItem
                  key={def.type}
                  def={def}
                  onSelect={onSelect}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {(flowItems.length > 0 || showBranch) && (
          <SidebarGroup>
            <SidebarGroupLabel>Flow Logic</SidebarGroupLabel>
            <SidebarMenu>
              {flowItems.map((def) => (
                <StepMenuItem
                  key={def.type}
                  def={def}
                  onSelect={onSelect}
                />
              ))}
              {showBranch && onAddBranch && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={onAddBranch}>
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                      style={{
                        backgroundColor: `${STEP_ACCENT.branch}20`,
                        color: STEP_ACCENT.branch,
                      }}
                    >
                      <GitFork className="h-3 w-3" />
                    </div>
                    <span>Branch</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {filtered.length === 0 && !showBranch && (
          <p className="px-4 py-8 text-center text-sm text-sidebar-foreground/50">
            No steps match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  )
}

function StepMenuItem({
  def,
  onSelect,
}: {
  def: (typeof STEP_DEFINITIONS)[number]
  onSelect: (type: StepType) => void
}) {
  const Icon = def.icon
  const accent = STEP_ACCENT[def.type] ?? "#64748b"

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => onSelect(def.type)}>
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          <Icon className="h-3 w-3" />
        </div>
        <span>{def.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
