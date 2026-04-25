"use client"

import React from "react"
import { Handle, Position, NodeProps } from "reactflow"

export function StartNode(_: NodeProps) {
  return (
    <div className="px-6 py-2 rounded-full border-2 border-foreground bg-background text-sm font-medium text-foreground shadow-sm">
      __start__
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-background !border-2 !border-foreground"
      />
    </div>
  )
}

export function EndNode(_: NodeProps) {
  return (
    <div className="px-6 py-2 rounded-full border-2 border-foreground bg-background text-sm font-medium text-foreground shadow-sm">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-background !border-2 !border-foreground"
      />
      __end__
    </div>
  )
}
