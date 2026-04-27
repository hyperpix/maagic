import type { Node, Edge } from "reactflow"
import type { WorkflowStep, StepNodeData } from "./types"

/**
 * Converts a ReactFlow graph (nodes + edges) into a WorkflowStep[] array
 * that workflowRunner.ts can execute.
 *
 * Rules:
 * - Traversal starts from the trigger node
 * - ConditionNode forks: sourceHandle "true" → branches[0], "false" → branches[1]
 * - Disconnected nodes (no path from trigger) are skipped
 * - Cycles: visited set prevents infinite loops
 */
export function graphToSteps(
  nodes: Node<StepNodeData>[],
  edges: Edge[]
): WorkflowStep[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  // Build adjacency: source → outgoing edges
  const edgesBySource = new Map<string, Edge[]>()
  for (const edge of edges) {
    if (!edgesBySource.has(edge.source)) edgesBySource.set(edge.source, [])
    edgesBySource.get(edge.source)!.push(edge)
  }

  const triggerNode = nodes.find((n) => n.data.step.type === "trigger")
  if (!triggerNode) return []

  const visited = new Set<string>()

  function traverse(nodeId: string): WorkflowStep[] {
    if (visited.has(nodeId)) return [] // cycle guard
    visited.add(nodeId)

    const node = nodeMap.get(nodeId)
    if (!node) return []

    const step: WorkflowStep = { ...node.data.step, config: { ...node.data.step.config } }
    const outEdges = edgesBySource.get(nodeId) ?? []

    if (step.type === "condition") {
      const trueEdge = outEdges.find((e) => e.sourceHandle === "true")
      const falseEdge = outEdges.find((e) => e.sourceHandle === "false")

      step.branches = [
        {
          id: "true",
          name: "True",
          steps: trueEdge ? traverse(trueEdge.target) : [],
        },
        {
          id: "false",
          name: "False",
          steps: falseEdge ? traverse(falseEdge.target) : [],
        },
      ]

      return [step]
    }

    // Linear node: follow first outgoing edge
    const next = outEdges[0]
    if (next) {
      return [step, ...traverse(next.target)]
    }
    return [step]
  }

  return traverse(triggerNode.id)
}
