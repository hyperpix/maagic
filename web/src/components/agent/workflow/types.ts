export type StepType =
  | "trigger"
  | "llm"
  | "knowledge"
  | "condition"
  | "api"
  | "delay"
  | "email"
  | "human_handoff"
  | "branch"
  | "loop"
  | "branchHub"
  | "branchCard"
  | "orders"
  | "issues"
  | "items"

export interface WorkflowBranch {
  id: string
  name: string
  condition?: string
  steps: WorkflowStep[]
}

export interface WorkflowStep {
  id: string
  type: StepType
  name: string
  config: Record<string, unknown>
  branches?: WorkflowBranch[]
}

export interface Workflow {
  name: string
  steps: WorkflowStep[]
}

// ── ReactFlow node data shape ─────────────────────────────────────────────

export interface StepNodeData {
  step: WorkflowStep
}
