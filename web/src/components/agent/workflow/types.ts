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

// ── ReactFlow node data shapes ──────────────────────────────────────────────

export interface StepNodeData {
  step: WorkflowStep
  isFirst: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export interface BranchNodeData {
  branch: WorkflowBranch
  parentStepId: string
  onSelect: (id: string) => void
  onDeleteBranch: (parentId: string, branchId: string) => void
}

export interface EdgeData {
  insertAfterId: string | null
  onAddStep: (insertAfterId: string | null, branchPath?: BranchPath) => void
  onAddBranch: (afterStepId: string) => void
  isBranchEdge?: boolean
}

export interface BranchPath {
  parentStepId: string
  branchId: string
}
