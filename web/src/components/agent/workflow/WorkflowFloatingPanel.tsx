"use client"

import { ProviderContext } from "@inngest/workflow-kit/ui"
import type { PublicEngineAction } from "@inngest/workflow-kit"
import { useContext, useEffect, useState, useCallback } from "react"
import { X, Trash2, Brain, Database, GitBranch, Globe, Mail, Clock, User, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Icon map matching step-definitions.ts
const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  llm: Brain,
  knowledge: Database,
  condition: GitBranch,
  api: Globe,
  email: Mail,
  delay: Clock,
  human_handoff: User,
  trigger: Zap,
}

interface Pos { x: number; y: number }

function useNodeScreenPos(nodeId: string | undefined): Pos | null {
  const [pos, setPos] = useState<Pos | null>(null)

  const compute = useCallback(() => {
    if (!nodeId) { setPos(null); return }
    const el = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | null
    if (!el) { setPos(null); return }
    const rect = el.getBoundingClientRect()
    const PANEL_W = 272
    const PANEL_H = 160
    const margin = 12

    // Prefer right-side of node; flip left if near edge
    let x = rect.right + margin
    if (x + PANEL_W > window.innerWidth - margin) {
      x = rect.left - PANEL_W - margin
    }
    x = Math.max(margin, Math.min(x, window.innerWidth - PANEL_W - margin))

    let y = rect.top + 16
    y = Math.max(64, Math.min(y, window.innerHeight - PANEL_H - margin))

    setPos({ x, y })
  }, [nodeId])

  useEffect(() => {
    compute()
    window.addEventListener("wheel", compute, { passive: true })
    window.addEventListener("pointermove", compute, { passive: true })
    return () => {
      window.removeEventListener("wheel", compute)
      window.removeEventListener("pointermove", compute)
    }
  }, [compute])

  return pos
}

export function WorkflowFloatingPanel() {
  const ctx = useContext(ProviderContext)

  const selectedNode = ctx?.selectedNode
  const availableActions = ctx?.availableActions ?? []
  const setSelectedNode = ctx?.setSelectedNode
  const deleteAction = ctx?.deleteAction
  const appendAction = ctx?.appendAction
  const blankNode = ctx?.blankNode

  const pos = useNodeScreenPos(selectedNode?.id)

  if (!ctx || !selectedNode || !pos) return null

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    left: pos.x,
    top: pos.y,
    zIndex: 100,
    width: 272,
  }

  // ── Action picker ─────────────────────────────────────────────────────────
  if (selectedNode.type === "blank") {
    return (
      <div
        style={panelStyle}
        className="bg-popover border border-border rounded-lg shadow-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
      >
        <div className="px-3 py-2.5 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Add step
          </p>
        </div>
        <ScrollArea className="max-h-[280px]">
          <div className="p-1">
            {availableActions.map((action: PublicEngineAction) => {
              const Icon = STEP_ICONS[action.kind] ?? Zap
              return (
                <button
                  key={action.kind}
                  onClick={() => {
                    if (!blankNode || !appendAction || !setSelectedNode) return
                    appendAction(action, (blankNode as any).data.parent.id, (blankNode as any).data.edge)
                    setSelectedNode(undefined)
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-background transition-colors">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground leading-tight">
                      {action.name}
                    </p>
                    {action.description && (
                      <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                        {action.description}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // ── Node config panel ─────────────────────────────────────────────────────
  if (selectedNode.type === "action") {
    const action = selectedNode.data.action as { id: string; kind: string; name?: string }
    const engineAction = availableActions.find((a: PublicEngineAction) => a.kind === action.kind)
    const Icon = STEP_ICONS[action.kind] ?? Zap
    const label = engineAction?.name ?? action.kind

    return (
      <div
        style={panelStyle}
        className="bg-popover border border-border rounded-lg shadow-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-3.5 pt-3.5 pb-3">
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground leading-tight truncate">
                {label}
              </p>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide h-4 px-1.5 shrink-0">
                Step
              </Badge>
            </div>
            {engineAction?.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                {engineAction.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedNode?.(undefined)}
            className="shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center hover:bg-accent text-muted-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <Separator />

        {/* Actions */}
        <div className="px-3.5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 h-8 text-destructive hover:text-destructive hover:bg-destructive/10 justify-start"
            onClick={() => {
              deleteAction?.(action.id)
              setSelectedNode?.(undefined)
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete step
          </Button>
        </div>
      </div>
    )
  }

  return null
}
