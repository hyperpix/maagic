"use client"

import React from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { AgentNodeData } from "./agent-canvas"
import { 
  Brain, 
  Database, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  GitBranch,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

const nodeIcons = {
  llm: Brain,
  knowledge: Database,
  tool: Zap,
  input: ArrowRight,
  output: ArrowLeft,
  condition: GitBranch,
  api: Globe,
}

export function AgentCanvasNode({ data, selected }: NodeProps<AgentNodeData>) {
  const Icon = nodeIcons[data.type] || Brain

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-lg rounded-lg border-2 bg-background min-w-[150px]",
        selected ? "border-primary" : "border-border"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.label}</div>
          {data.config && Object.keys(data.config).length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              {data.type === "llm" && data.config.model && (
                <span>{data.config.model}</span>
              )}
              {data.type === "knowledge" && data.config.maxRetrieve && (
                <span>Max: {data.config.maxRetrieve}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

