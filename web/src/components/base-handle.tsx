"use client"

import React from "react"
import { Handle, type HandleProps } from "reactflow"
import { cn } from "@/lib/utils"

export function BaseHandle({
  className,
  style,
  ...props
}: HandleProps & { className?: string; style?: React.CSSProperties }) {
  return (
    <Handle
      style={style}
      className={cn(
        "!h-3 !w-3 !rounded-full !border-2 !border-background !bg-muted-foreground/50 transition-colors hover:!bg-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
