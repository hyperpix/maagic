"use client"

import React from "react"
import { Handle, HandleProps, useStore } from "reactflow"
import { cn } from "@/lib/utils"

interface ButtonHandleProps extends Omit<HandleProps, "style"> {
  nodeId: string
  showButton?: boolean
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ButtonHandle({
  nodeId,
  children,
  showButton = true,
  className,
  style,
  ...handleProps
}: ButtonHandleProps) {
  const connectionInProgress = useStore((s) => !!s.connectionNodeId)
  const visible = showButton && !connectionInProgress

  return (
    <Handle
      className={cn(
        "!h-2.5 !w-2.5 !rounded-full !border-2 !border-background !bg-muted-foreground/40 !overflow-visible",
        className
      )}
      style={style}
      {...handleProps}
    >
      {visible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center nodrag nopan pointer-events-auto">
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-px rounded-lg border border-border bg-background shadow-sm overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </Handle>
  )
}
