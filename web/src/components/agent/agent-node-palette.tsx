"use client"

import React from "react"
import { 
  Brain, 
  Database, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  GitBranch,
  Globe
} from "lucide-react"
import { NodeType } from "./agent-canvas"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NodePaletteItem {
  type: NodeType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const nodeTypes: NodePaletteItem[] = [
  {
    type: "llm",
    label: "LLM",
    icon: Brain,
    description: "AI model for generating responses",
  },
  {
    type: "knowledge",
    label: "Knowledge Base",
    icon: Database,
    description: "Retrieve information from knowledge base",
  },
  {
    type: "tool",
    label: "Tool",
    icon: Zap,
    description: "Execute a function or tool",
  },
  {
    type: "api",
    label: "API",
    icon: Globe,
    description: "Call external API endpoint",
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    description: "Conditional logic branch",
  },
  {
    type: "input",
    label: "Input",
    icon: ArrowRight,
    description: "User input handler",
  },
  {
    type: "output",
    label: "Output",
    icon: ArrowLeft,
    description: "Final response output",
  },
]

interface AgentNodePaletteProps {
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void
}

export function AgentNodePalette({ onAddNode }: AgentNodePaletteProps) {
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData("application/reactflow", nodeType)
    e.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="w-64 border-r bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Node Palette</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag nodes onto the canvas
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {nodeTypes.map((node) => {
            const Icon = node.icon
            return (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type)}
                className="p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{node.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {node.description}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

