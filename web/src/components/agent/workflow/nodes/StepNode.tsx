"use client"

import { memo } from "react"
import { NodeProps, Position } from "reactflow"
import { GitBranch, Plus } from "lucide-react"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle } from "@/components/base-node"
import { BaseHandle } from "@/components/base-handle"
import { ButtonHandle } from "@/components/button-handle"
import { STEP_DEF_MAP } from "../step-definitions"
import { STEP_ACCENT } from "./node-shared"
import type { StepNodeData } from "../types"
import { useWorkflowContext } from "../WorkflowContext"

export const StepNode = memo(function StepNode({ id, data, selected }: NodeProps<StepNodeData>) {
  const { actions, setInsertContext, setRightSidebarOpen } = useWorkflowContext()
  const def = STEP_DEF_MAP[data.step.type]
  const Icon = def?.icon
  const accent = STEP_ACCENT[data.step.type] ?? "#64748b"

  return (
    <BaseNode selected={selected} className="w-56 cursor-pointer select-none">
      <BaseHandle type="target" position={Position.Top} style={{ top: -5 }} />

      <BaseNodeHeader>
        {Icon && (
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${accent}20`, color: accent }}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
        <BaseNodeHeaderTitle>{data.step.name}</BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <ButtonHandle nodeId={id} type="source" position={Position.Bottom} style={{ bottom: -5 }}>
        <button
          title="Add branch"
          onClick={() => actions?.insertBranchAfter(id, null)}
          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <GitBranch className="h-3 w-3" />
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          title="Add step"
          onClick={() => { setInsertContext({ sourceId: id, targetId: null }); setRightSidebarOpen(true) }}
          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="h-3 w-3" />
        </button>
      </ButtonHandle>
    </BaseNode>
  )
})
