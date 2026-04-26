"use client"

import { cn } from "@/lib/utils"
import { Handle, Position } from "reactflow"

export const STEP_ACCENT: Record<string, string> = {
  trigger:       "#3b82f6",
  llm:           "#8b5cf6",
  knowledge:     "#f59e0b",
  condition:     "#10b981",
  api:           "#06b6d4",
  email:         "#f43f5e",
  delay:         "#f97316",
  human_handoff: "#14b8a6",
  branch:        "#6366f1",
  loop:          "#64748b",
}

export function NodeTopHandle() {
  return (
    <Handle
      type="target"
      position={Position.Top}
      className="!w-2.5 !h-2.5 !bg-background !border-2 !border-border !rounded-full"
      style={{ top: -5 }}
    />
  )
}

export function NodeBottomHandle({ id, style }: { id?: string; style?: React.CSSProperties }) {
  return (
    <Handle
      type="source"
      position={Position.Bottom}
      id={id}
      style={{ bottom: -5, ...style }}
      className="!w-2.5 !h-2.5 !bg-background !border-2 !border-border !rounded-full"
    />
  )
}

export function NodeCard({
  accent,
  selected,
  children,
  className,
}: {
  accent: string
  selected: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative bg-card border border-border rounded-lg shadow-sm cursor-pointer select-none overflow-hidden",
        selected && "ring-2 ring-ring ring-offset-1",
        className
      )}
      style={{ width: 220 }}
    >
      <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-lg" style={{ backgroundColor: accent }} />
      <div className="pl-3.5">{children}</div>
    </div>
  )
}

export function NodeIconBox({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div
      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${accent}18` }}
    >
      <span style={{ color: accent }}>{children}</span>
    </div>
  )
}
