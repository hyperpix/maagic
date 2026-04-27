"use client"

import { memo } from "react"
import { Handle, NodeProps, Position } from "reactflow"
import { GitBranch } from "lucide-react"
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle, BaseNodeFooter } from "@/components/base-node"
import { BaseHandle } from "@/components/base-handle"
import { STEP_ACCENT } from "./node-shared"
import type { StepNodeData } from "../types"

const accent = STEP_ACCENT.condition

export const ConditionNode = memo(function ConditionNode({ data, selected }: NodeProps<StepNodeData>) {
  return (
    <BaseNode selected={selected} className="w-56 cursor-pointer select-none">
      <BaseHandle type="target" position={Position.Top} style={{ top: -6 }} />

      <BaseNodeHeader className="border-b border-border/60">
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: `${accent}20` }}
        >
          <GitBranch className="h-3.5 w-3.5" style={{ color: accent }} />
        </div>
        <BaseNodeHeaderTitle>{data.step.name}</BaseNodeHeaderTitle>
      </BaseNodeHeader>

      <BaseNodeFooter className="flex-row justify-between py-1.5">
        <span className="text-[11px] font-medium" style={{ color: accent }}>True</span>
        <span className="text-[11px] font-medium text-rose-500">False</span>
      </BaseNodeFooter>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ bottom: -6, left: "28%" }}
        className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-background !bg-emerald-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ bottom: -6, left: "72%" }}
        className="!h-2.5 !w-2.5 !rounded-full !border-2 !border-background !bg-rose-400"
      />
    </BaseNode>
  )
})
