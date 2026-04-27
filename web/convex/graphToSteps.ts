// Backend version of graphToSteps — no reactflow dependency.
// Works directly on JSON-parsed node/edge arrays saved by WorkflowCanvas.

interface RawNode {
  id: string
  data: { step: WorkflowStep }
}

interface RawEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
}

interface WorkflowBranch {
  id: string
  name: string
  condition?: string
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  type: string
  name: string
  config: Record<string, unknown>
  branches?: WorkflowBranch[]
}

export function graphToSteps(
  nodes: RawNode[],
  edges: RawEdge[]
): WorkflowStep[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const edgesBySource = new Map<string, RawEdge[]>()

  for (const edge of edges) {
    if (!edgesBySource.has(edge.source)) edgesBySource.set(edge.source, [])
    edgesBySource.get(edge.source)!.push(edge)
  }

  const triggerNode = nodes.find((n) => n.data.step.type === "trigger")
  if (!triggerNode) return []

  const visited = new Set<string>()

  function traverse(nodeId: string): WorkflowStep[] {
    if (visited.has(nodeId)) return []
    visited.add(nodeId)

    const node = nodeMap.get(nodeId)
    if (!node) return []

    const step: WorkflowStep = { ...node.data.step, config: { ...node.data.step.config } }
    const outEdges = edgesBySource.get(nodeId) ?? []

    if (step.type === "condition") {
      const trueEdge = outEdges.find((e) => e.sourceHandle === "true")
      const falseEdge = outEdges.find((e) => e.sourceHandle === "false")

      step.branches = [
        { id: "true", name: "True", steps: trueEdge ? traverse(trueEdge.target) : [] },
        { id: "false", name: "False", steps: falseEdge ? traverse(falseEdge.target) : [] },
      ]

      return [step]
    }

    const next = outEdges[0]
    if (next) {
      return [step, ...traverse(next.target)]
    }
    return [step]
  }

  return traverse(triggerNode.id)
}
