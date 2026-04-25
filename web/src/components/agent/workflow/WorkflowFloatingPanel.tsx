"use client"

import { ProviderContext } from "@inngest/workflow-kit/ui"
import type { PublicEngineAction } from "@inngest/workflow-kit"
import { useContext, useEffect, useState, useCallback } from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Pos { x: number; y: number }

function useNodeScreenPos(nodeId: string | undefined): Pos | null {
  const [pos, setPos] = useState<Pos | null>(null)

  const compute = useCallback(() => {
    if (!nodeId) { setPos(null); return }
    const el = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | null
    if (!el) { setPos(null); return }
    const rect = el.getBoundingClientRect()
    const PANEL_W = 280
    const PANEL_H = 180
    const margin = 12

    // Prefer right of node; if off-screen flip left
    let x = rect.right + margin
    if (x + PANEL_W > window.innerWidth - margin) {
      x = rect.left - PANEL_W - margin
    }
    // Clamp to viewport
    x = Math.max(margin, Math.min(x, window.innerWidth - PANEL_W - margin))

    let y = rect.top + 16
    y = Math.max(64, Math.min(y, window.innerHeight - PANEL_H - margin))

    setPos({ x, y })
  }, [nodeId])

  useEffect(() => {
    compute()
    // Re-compute when canvas pans/zooms (wheel + pointer move during drag)
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

  const style: React.CSSProperties = {
    position: "fixed",
    left: pos.x,
    top: pos.y,
    zIndex: 100,
    width: 264,
  }

  // Action picker — shown when "+" is clicked and a blank node placeholder appears
  if (selectedNode.type === "blank") {
    return (
      <div style={style} className="bg-card border rounded-xl shadow-xl overflow-hidden">
        <div className="px-3 pt-3 pb-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Add step
          </p>
        </div>
        <ScrollArea className="max-h-72">
          <div className="pb-2">
            {availableActions.map((action: PublicEngineAction) => (
              <button
                key={action.kind}
                onClick={() => {
                  if (!blankNode || !appendAction || !setSelectedNode) return
                  appendAction(action, (blankNode as any).data.parent.id, (blankNode as any).data.edge)
                  setSelectedNode(undefined)
                }}
                className="w-full flex flex-col items-start gap-0.5 px-3 py-2 hover:bg-muted transition-colors text-left"
              >
                <span className="text-sm font-medium">{action.name}</span>
                {action.description && (
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {action.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Node config panel — shown when a step node is clicked
  if (selectedNode.type === "action") {
    const action = selectedNode.data.action as { id: string; kind: string; name?: string }
    const engineAction = availableActions.find((a: PublicEngineAction) => a.kind === action.kind)

    return (
      <div style={style} className="bg-card border rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3 border-b">
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight">
              {engineAction?.name ?? action.kind}
            </p>
            {engineAction?.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {engineAction.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedNode?.(undefined)}
            className="shrink-0 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <Button
            variant="destructive"
            size="sm"
            className="w-full gap-1.5 h-8"
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
