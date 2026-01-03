"use client"

import React, { useCallback, useState } from "react"
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"
import { AgentCanvasNode } from "./agent-canvas-node"
import { AgentNodeConfig } from "./agent-node-config"

export type NodeType = 
  | "llm" 
  | "knowledge" 
  | "tool" 
  | "input" 
  | "output" 
  | "condition"
  | "api"

export interface AgentNodeData {
  label: string
  type: NodeType
  config?: Record<string, any>
}

const nodeTypes: NodeTypes = {
  agentNode: AgentCanvasNode,
}

const initialNodes: Node<AgentNodeData>[] = [
  {
    id: "1",
    type: "agentNode",
    position: { x: 250, y: 100 },
    data: { label: "LLM", type: "llm", config: { model: "gpt-4o-mini", temperature: 0.7 } },
  },
  {
    id: "2",
    type: "agentNode",
    position: { x: 250, y: 250 },
    data: { label: "Knowledge Base", type: "knowledge", config: { maxRetrieve: 3 } },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
]

export function AgentCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node<AgentNodeData> | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<AgentNodeData>) => {
      setSelectedNode(node)
    },
    []
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleAddNode = useCallback(
    (nodeType: NodeType, position: { x: number; y: number }) => {
      const newNode: Node<AgentNodeData> = {
        id: `${nodeType}-${Date.now()}`,
        type: "agentNode",
        position,
        data: {
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
          type: nodeType,
          config: {},
        },
      }
      setNodes((nds) => [...nds, newNode])
    },
    [setNodes]
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const nodeType = event.dataTransfer.getData("application/reactflow") as NodeType
      if (!nodeType) return

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      handleAddNode(nodeType, position)
    },
    [handleAddNode]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onUpdateNodeConfig = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
            : node
        )
      )
    },
    [setNodes]
  )

  return (
    <div className="flex h-full w-full">
      {/* Canvas */}
      <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/20"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Node Configuration Panel */}
      {selectedNode && (
        <AgentNodeConfig
          node={selectedNode}
          onUpdateConfig={(config) => onUpdateNodeConfig(selectedNode.id, config)}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}

