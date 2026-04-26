"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactFlow, {
  Background,
  BackgroundVariant,
  Node,
  Edge,
  NodeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeMouseHandler,
} from "reactflow"
import "reactflow/dist/style.css"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Loader2, Undo2, Redo2, ArrowDown, ArrowRight, LayoutGrid } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { StepNode } from "./nodes/StepNode"
import { TriggerNode } from "./nodes/TriggerNode"
import { ConditionNode } from "./nodes/ConditionNode"
import { BranchHubNode, HUB_WIDTH, LEFT_RATIO, RIGHT_RATIO } from "./nodes/BranchHubNode"
import { BranchCardNode, CARD_WIDTH } from "./nodes/BranchCardNode"
import { ButtonEdge } from "./nodes/ButtonEdge"
import type { StepNodeData, WorkflowStep, StepType } from "./types"
import { STEP_DEF_MAP } from "./step-definitions"
import { useWorkflowContext } from "./WorkflowContext"

const NODE_TYPES: NodeTypes = {
  triggerNode: TriggerNode,
  stepNode: StepNode,
  conditionNode: ConditionNode,
  branchHub: BranchHubNode,
  branchCard: BranchCardNode,
}

const EDGE_TYPES = { buttonEdge: ButtonEdge }


function nodeTypeForStep(type: StepType): string {
  if (type === "trigger") return "triggerNode"
  if (type === "condition") return "conditionNode"
  return "stepNode"
}

const BASE_TRIGGER: Node<StepNodeData> = {
  id: "trigger-1",
  type: "triggerNode",
  position: { x: 100, y: 60 },
  data: { step: { id: "trigger-1", type: "trigger", name: "Customer Message", config: {} } },
  deletable: false,
}

const DEFAULT_NODES: Node<StepNodeData>[] = [
  BASE_TRIGGER,
  {
    id: "knowledge-1",
    type: "stepNode",
    position: { x: 100, y: 180 },
    data: { step: { id: "knowledge-1", type: "knowledge", name: "Knowledge Search", config: { maxRetrieve: 3, threshold: 0.5 } } },
  },
  {
    id: "llm-1",
    type: "stepNode",
    position: { x: 100, y: 300 },
    data: { step: { id: "llm-1", type: "llm", name: "LLM Response", config: { model: "gpt-4o-mini", temperature: 0.7, maxTokens: 1024, systemPrompt: "" } } },
  },
]

const DEFAULT_EDGES: Edge[] = [
  { id: "e-trigger-knowledge", source: "trigger-1", target: "knowledge-1", type: "buttonEdge" },
  { id: "e-knowledge-llm", source: "knowledge-1", target: "llm-1", type: "buttonEdge" },
]

function parseStoredWorkflow(raw: { nodes: string; edges: string } | null | undefined): {
  nodes: Node<StepNodeData>[]
  edges: Edge[]
} {
  if (!raw) return { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES }
  try {
    const parsedNodes = JSON.parse(raw.nodes)
    const parsedEdges = JSON.parse(raw.edges)
    if (!Array.isArray(parsedNodes) || (parsedNodes[0] && !("position" in parsedNodes[0]))) {
      return { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES }
    }
    // Ensure trigger always exists
    const hasTrigger = parsedNodes.some((n: Node<StepNodeData>) => n.data?.step?.type === "trigger")
    const finalNodes = hasTrigger ? parsedNodes : [BASE_TRIGGER, ...parsedNodes]
    return { nodes: finalNodes, edges: parsedEdges }
  } catch {
    return { nodes: DEFAULT_NODES, edges: DEFAULT_EDGES }
  }
}

export function WorkflowCanvas() {
  const { setSelectedStep, setActions } = useWorkflowContext()

  const savedWorkflow = useQuery(api.workflows.getWorkflow)
  const saveWorkflow = useMutation(api.workflows.saveWorkflow)

  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<StepNodeData>(DEFAULT_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEFAULT_EDGES)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [layoutDirection, setLayoutDirection] = useState<"vertical" | "horizontal">("vertical")

  // Undo/redo history
  const historyRef = useRef<{ nodes: Node<StepNodeData>[]; edges: Edge[] }[]>([])
  const historyIndexRef = useRef(-1)

  const pushHistory = useCallback((n: Node<StepNodeData>[], e: Edge[]) => {
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
    historyRef.current.push({ nodes: n, edges: e })
    historyIndexRef.current = historyRef.current.length - 1
  }, [])

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    const { nodes: n, edges: e } = historyRef.current[historyIndexRef.current]
    setNodes(n)
    setEdges(e)
  }, [setNodes, setEdges])

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    const { nodes: n, edges: e } = historyRef.current[historyIndexRef.current]
    setNodes(n)
    setEdges(e)
  }, [setNodes, setEdges])

  useEffect(() => {
    if (loaded) return
    if (savedWorkflow === undefined) return
    const parsed = parseStoredWorkflow(savedWorkflow)
    setNodes(parsed.nodes)
    setEdges(parsed.edges)
    setLoaded(true)
  }, [savedWorkflow, loaded, setNodes, setEdges])

  const scheduleSave = useCallback(
    (nextNodes: Node<StepNodeData>[], nextEdges: Edge[]) => {
      if (!loaded) return
      pushHistory(nextNodes, nextEdges)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        setSaving(true)
        try {
          await saveWorkflow({ nodes: JSON.stringify(nextNodes), edges: JSON.stringify(nextEdges) })
        } catch {
          toast.error("Failed to save workflow")
        } finally {
          setSaving(false)
        }
      }, 1200)
    },
    [loaded, saveWorkflow, pushHistory]
  )

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current) }, [])

  const handleAutoLayout = useCallback(() => {
    const spacing = layoutDirection === "vertical" ? { x: 0, y: 140 } : { x: 260, y: 0 }
    const laid = nodes.map((node, i) => ({
      ...node,
      position: { x: 190 + i * spacing.x, y: 60 + i * spacing.y },
    }))
    setNodes(laid)
    scheduleSave(laid, edges)
  }, [nodes, edges, layoutDirection, setNodes, scheduleSave])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params, type: "buttonEdge" }, edges)
      setEdges(newEdges)
      scheduleSave(nodes, newEdges)
    },
    [edges, nodes, setEdges, scheduleSave]
  )

  const onNodeDragStop = useCallback(() => {
    scheduleSave(nodes, edges)
  }, [nodes, edges, scheduleSave])

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    setSelectedNodeId(node.id)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null
  const selectedStep = selectedNode?.data.step ?? null

  const updateStep = useCallback(
    (updater: (prev: WorkflowStep) => WorkflowStep) => {
      if (!selectedNodeId) return
      const nextNodes = nodes.map((n) =>
        n.id === selectedNodeId
          ? { ...n, data: { ...n.data, step: updater(n.data.step) } }
          : n
      )
      setNodes(nextNodes)
      scheduleSave(nextNodes, edges)
    },
    [selectedNodeId, nodes, edges, setNodes, scheduleSave]
  )

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return
    const target = nodes.find((n) => n.id === selectedNodeId)
    if (target?.data.step.type === "trigger") return  // trigger is permanent
    const nextNodes = nodes.filter((n) => n.id !== selectedNodeId)
    const nextEdges = edges.filter(
      (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
    )
    setNodes(nextNodes)
    setEdges(nextEdges)
    setSelectedNodeId(null)
    scheduleSave(nextNodes, nextEdges)
  }, [selectedNodeId, nodes, edges, setNodes, setEdges, scheduleSave])

  const addStep = useCallback(
    (type: StepType) => {
      if (type === "trigger") return  // only one trigger allowed
      const def = STEP_DEF_MAP[type]
      const id = `${type}-${Date.now()}`
      const lastNode = nodes[nodes.length - 1]
      const position = lastNode
        ? { x: lastNode.position.x, y: lastNode.position.y + 140 }
        : { x: 190, y: 200 }

      const newNode: Node<StepNodeData> = {
        id,
        type: nodeTypeForStep(type),
        position,
        data: {
          step: {
            id,
            type,
            name: def?.defaultName ?? type,
            config: { ...(def?.defaultConfig ?? {}) },
          },
        },
      }

      const nextNodes = [...nodes, newNode]
      let nextEdges = edges
      if (lastNode) {
        const hasOutgoing = edges.some((e) => e.source === lastNode.id && !e.sourceHandle)
        if (!hasOutgoing && lastNode.data.step.type !== "condition") {
          nextEdges = [
            ...edges,
            { id: `e-${lastNode.id}-${id}`, source: lastNode.id, target: id, type: "buttonEdge" },
          ]
        }
      }

      setNodes(nextNodes)
      setEdges(nextEdges)
      setSelectedNodeId(id)
      scheduleSave(nextNodes, nextEdges)
    },
    [nodes, edges, setNodes, setEdges, scheduleSave]
  )

  const addBranch = useCallback(
    (afterNodeId?: string) => {
      const branchableTypes = ["triggerNode", "stepNode", "conditionNode"]
      const afterNode = afterNodeId
        ? nodes.find((n) => n.id === afterNodeId)
        : [...nodes].reverse().find((n) => branchableTypes.includes(n.type ?? ""))
      if (!afterNode) return

      const ts = Date.now()
      const hubId = `branch-hub-${ts}`
      const card1Id = `branch-card-${ts}-1`
      const card2Id = `branch-card-${ts}-2`

      // Center hub on the parent node (w-56 = 224px, half = 112)
      const parentCx = afterNode.position.x + 112
      const hubX = parentCx - HUB_WIDTH / 2
      const hubY = afterNode.position.y + 300

      // Align branch card centers with hub source handles
      const card1X = Math.round(hubX + HUB_WIDTH * LEFT_RATIO - CARD_WIDTH / 2)
      const card2X = Math.round(hubX + HUB_WIDTH * RIGHT_RATIO - CARD_WIDTH / 2)
      const cardsY = hubY + 80

      const newNodes: Node<StepNodeData>[] = [
        {
          id: hubId,
          type: "branchHub",
          position: { x: hubX, y: hubY },
          data: { step: { id: hubId, type: "branchHub", name: "Branch Hub", config: {} } },
        },
        {
          id: card1Id,
          type: "branchCard",
          position: { x: card1X, y: cardsY },
          data: { step: { id: card1Id, type: "branchCard", name: "Branch 1", config: { branchIndex: 1, condition: "" } } },
        },
        {
          id: card2Id,
          type: "branchCard",
          position: { x: card2X, y: cardsY },
          data: { step: { id: card2Id, type: "branchCard", name: "Branch 2", config: { branchIndex: 2, condition: "" } } },
        },
      ]

      const newEdges: Edge[] = [
        { id: `e-${afterNode.id}-${hubId}`, source: afterNode.id, target: hubId, type: "straight" },
        { id: `e-${hubId}-${card1Id}`, source: hubId, target: card1Id, sourceHandle: "left", type: "straight" },
        { id: `e-${hubId}-${card2Id}`, source: hubId, target: card2Id, sourceHandle: "right", type: "straight" },
      ]

      const nextNodes = [...nodes, ...newNodes]
      const nextEdges = [...edges, ...newEdges]
      setNodes(nextNodes)
      setEdges(nextEdges)
      scheduleSave(nextNodes, nextEdges)
    },
    [nodes, edges, setNodes, setEdges, scheduleSave]
  )

  const insertStepAfter = useCallback(
    (sourceId: string, targetId: string | null, type: StepType = "llm") => {
      if (type === "trigger") return
      const sourceNode = nodes.find((n) => n.id === sourceId)
      if (!sourceNode) return
      const ts = Date.now()
      const newId = `${type}-${ts}`
      const def = STEP_DEF_MAP[type]
      const newNode: Node<StepNodeData> = {
        id: newId,
        type: nodeTypeForStep(type),
        position: { x: sourceNode.position.x, y: sourceNode.position.y + 160 },
        data: { step: { id: newId, type, name: def?.defaultName ?? type, config: { ...(def?.defaultConfig ?? {}) } } },
      }
      let nextEdges = targetId
        ? edges.filter((e) => !(e.source === sourceId && e.target === targetId))
        : [...edges]
      nextEdges = [
        ...nextEdges,
        { id: `e-${sourceId}-${newId}`, source: sourceId, target: newId, type: "buttonEdge" },
      ]
      if (targetId) {
        nextEdges = [...nextEdges, { id: `e-${newId}-${targetId}`, source: newId, target: targetId, type: "buttonEdge" }]
      }
      // Shift target and all its descendants down
      const visited = new Set<string>()
      const queue = targetId ? [targetId] : []
      while (queue.length) {
        const id = queue.shift()!
        if (visited.has(id)) continue
        visited.add(id)
        nextEdges.forEach((e) => { if (e.source === id) queue.push(e.target) })
      }
      const nextNodes = [...nodes, newNode].map((n) =>
        visited.has(n.id) ? { ...n, position: { ...n.position, y: n.position.y + 160 } } : n
      )
      setNodes(nextNodes)
      setEdges(nextEdges)
      setSelectedNodeId(newId)
      scheduleSave(nextNodes, nextEdges)
    },
    [nodes, edges, setNodes, setEdges, scheduleSave]
  )

  const insertBranchAfter = useCallback(
    (sourceId: string, targetId: string | null) => {
      const sourceNode = nodes.find((n) => n.id === sourceId)
      if (!sourceNode) return
      const ts = Date.now()
      const hubId = `branch-hub-${ts}`
      const card1Id = `branch-card-${ts}-1`
      const card2Id = `branch-card-${ts}-2`
      const parentCx = sourceNode.position.x + 112
      const hubX = parentCx - HUB_WIDTH / 2
      const hubY = sourceNode.position.y + 220
      const card1X = Math.round(hubX + HUB_WIDTH * LEFT_RATIO - CARD_WIDTH / 2)
      const card2X = Math.round(hubX + HUB_WIDTH * RIGHT_RATIO - CARD_WIDTH / 2)
      const cardsY = hubY + 80
      const newNodes: Node<StepNodeData>[] = [
        { id: hubId, type: "branchHub", position: { x: hubX, y: hubY }, data: { step: { id: hubId, type: "branchHub", name: "Branch Hub", config: {} } } },
        { id: card1Id, type: "branchCard", position: { x: card1X, y: cardsY }, data: { step: { id: card1Id, type: "branchCard", name: "Branch 1", config: { branchIndex: 1, condition: "" } } } },
        { id: card2Id, type: "branchCard", position: { x: card2X, y: cardsY }, data: { step: { id: card2Id, type: "branchCard", name: "Branch 2", config: { branchIndex: 2, condition: "" } } } },
      ]
      let nextEdges = targetId
        ? edges.filter((e) => !(e.source === sourceId && e.target === targetId))
        : [...edges]
      nextEdges = [
        ...nextEdges,
        { id: `e-${sourceId}-${hubId}`, source: sourceId, target: hubId, type: "straight" },
        { id: `e-${hubId}-${card1Id}`, source: hubId, target: card1Id, sourceHandle: "left", type: "straight" },
        { id: `e-${hubId}-${card2Id}`, source: hubId, target: card2Id, sourceHandle: "right", type: "straight" },
      ]
      const nextNodes = [...nodes, ...newNodes]
      setNodes(nextNodes)
      setEdges(nextEdges)
      scheduleSave(nextNodes, nextEdges)
    },
    [nodes, edges, setNodes, setEdges, scheduleSave]
  )

  // Keep context in sync with local state
  useEffect(() => {
    setSelectedStep(selectedStep)
  }, [selectedStep, setSelectedStep])

  useEffect(() => {
    setActions({
      addStep,
      addBranch,
      insertStepAfter,
      insertBranchAfter,
      updateSelectedConfig: (cfg) => updateStep((s) => ({ ...s, config: { ...s.config, ...cfg } })),
      updateSelectedName: (name) => updateStep((s) => ({ ...s, name })),
      deleteSelected: deleteSelectedNode,
      clearSelection: () => setSelectedNodeId(null),
    })
  }, [addStep, addBranch, insertStepAfter, insertBranchAfter, updateStep, deleteSelectedNode, setActions])

  return (
    <div className="w-full h-full relative">
      {saving && (
        <div className="absolute top-3 left-3 z-50 flex items-center gap-2 text-xs text-muted-foreground bg-background border rounded-lg px-3 py-1.5 shadow-sm pointer-events-none">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </div>
      )}

      {nodes.length === 0 ? (
        <div className="h-full flex items-center justify-center bg-muted/20">
          <p className="text-sm text-muted-foreground">No steps yet — pick one from the panel</p>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          deleteKeyCode="Delete"
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ style: { stroke: "#94a3b8", strokeWidth: 1.5 }, type: "step" }}
          className="bg-muted/20"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
      )}

      {/* Clear button — bottom right */}
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="h-9 shadow-sm text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          onClick={() => {
            setNodes([BASE_TRIGGER])
            setEdges([])
            setSelectedNodeId(null)
            scheduleSave([BASE_TRIGGER], [])
          }}
        >
          Clear
        </Button>
      </div>

      {/* Bottom-left canvas controls */}
      <div className="absolute bottom-4 left-4 z-50 flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-background border rounded-lg p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleUndo} title="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRedo} title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Auto layout */}
        <Button variant="outline" size="sm" className="h-9 shadow-sm" onClick={handleAutoLayout}>
          Auto layout
        </Button>

        {/* Direction tabs */}
        <Tabs value={layoutDirection} onValueChange={(v) => setLayoutDirection(v as "vertical" | "horizontal")}>
          <TabsList className="h-9 shadow-sm">
            <TabsTrigger value="vertical" className="px-3">Vertical</TabsTrigger>
            <TabsTrigger value="horizontal" className="px-3">Horizontal</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
