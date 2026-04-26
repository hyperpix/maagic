"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function BaseNode({
  className,
  selected,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { selected?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm",
        selected && "ring-2 ring-ring ring-offset-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function BaseNodeHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2 px-3 py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function BaseNodeHeaderTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("flex-1 truncate text-sm font-medium leading-none", className)} {...props}>
      {children}
    </h3>
  )
}

export function BaseNodeContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-3 py-2 text-sm", className)} {...props}>
      {children}
    </div>
  )
}

export function BaseNodeFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-t px-3 py-2 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
