"use client"

import { EdgeProps, getSmoothStepPath, BaseEdge, EdgeLabelRenderer } from "reactflow"
import { GitBranch, Plus } from "lucide-react"
import { useWorkflowContext } from "../WorkflowContext"

export function ButtonEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  target,
}: EdgeProps) {
  const { actions, setInsertContext, setRightSidebarOpen } = useWorkflowContext()
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    borderRadius: 0,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{ stroke: "#94a3b8", strokeWidth: 1.5 }}
      />

      {/* Buttons at midpoint of the edge */}
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto flex flex-col items-center"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <div className="flex items-center gap-px rounded-lg border border-border bg-background shadow-sm overflow-hidden">
            <button
              title="Add branch"
              onClick={() => actions?.insertBranchAfter(source, target)}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <GitBranch className="h-3 w-3" />
            </button>
            <div className="w-px h-4 bg-border" />
            <button
              title="Add step"
              onClick={() => {
                setInsertContext({ sourceId: source, targetId: target })
                setRightSidebarOpen(true)
              }}
              className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
