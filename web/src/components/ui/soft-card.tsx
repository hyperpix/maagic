import * as React from "react"
import { cn } from "@/lib/utils"

function SoftCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="soft-card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-[2rem] py-6 shadow-soft",
        className
      )}
      {...props}
    />
  )
}

function SoftCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="soft-card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-8",
        className
      )}
      {...props}
    />
  )
}

function SoftCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="soft-card-title"
      className={cn("leading-none font-semibold text-lg", className)}
      {...props}
    />
  )
}

function SoftCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="soft-card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function SoftCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="soft-card-content"
      className={cn("px-8", className)}
      {...props}
    />
  )
}

function SoftCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="soft-card-footer"
      className={cn("flex items-center px-8", className)}
      {...props}
    />
  )
}

export {
  SoftCard,
  SoftCardHeader,
  SoftCardFooter,
  SoftCardTitle,
  SoftCardDescription,
  SoftCardContent,
}
