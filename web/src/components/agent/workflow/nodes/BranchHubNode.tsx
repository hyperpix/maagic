"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import type { StepNodeData } from "../types"

export const HUB_WIDTH = 600
export const LEFT_RATIO = 0.10
export const RIGHT_RATIO = 0.90

export const BranchHubNode = memo(function BranchHubNode(_props: NodeProps<StepNodeData>) {
  return (
    <div style={{ width: HUB_WIDTH }} className="relative h-10 flex items-center justify-center">
      {/* Incoming connection handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ left: "50%", top: -4 }}
        className="!w-2 !h-2 !bg-background !border-2 !border-border !rounded-full"
      />

      {/* Horizontal connector line */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-px bg-border"
        style={{ left: `${LEFT_RATIO * 100}%`, right: `${(1 - RIGHT_RATIO) * 100}%` }}
      />

      {/* Left branch circle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-border bg-background"
        style={{ left: `${LEFT_RATIO * 100}%` }}
      />

      {/* Right branch circle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-border bg-background"
        style={{ left: `${RIGHT_RATIO * 100}%` }}
      />

      {/* Left source handle (hidden under the circle) */}
      <Handle
        type="source"
        id="left"
        position={Position.Bottom}
        style={{ left: `${LEFT_RATIO * 100}%`, bottom: -4 }}
        className="!w-3 !h-3 !bg-transparent !border-0"
      />

      {/* Right source handle (hidden under the circle) */}
      <Handle
        type="source"
        id="right"
        position={Position.Bottom}
        style={{ left: `${RIGHT_RATIO * 100}%`, bottom: -4 }}
        className="!w-3 !h-3 !bg-transparent !border-0"
      />
    </div>
  )
})
