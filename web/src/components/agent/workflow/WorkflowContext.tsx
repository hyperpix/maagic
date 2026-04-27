"use client"

import React, { createContext, useContext, useState } from "react"
import type { WorkflowStep, StepType } from "./types"

export interface InsertContext {
  sourceId: string
  targetId: string | null
}

interface WorkflowActions {
  addStep: (type: StepType) => void
  addBranch: (afterNodeId?: string) => void
  insertStepAfter: (sourceId: string, targetId: string | null, type: StepType) => void
  insertBranchAfter: (sourceId: string, targetId: string | null) => void
  updateSelectedConfig: (cfg: Record<string, unknown>) => void
  updateSelectedName: (name: string) => void
  deleteSelected: () => void
  clearSelection: () => void
}

interface WorkflowContextValue {
  selectedStep: WorkflowStep | null
  actions: WorkflowActions | null
  insertContext: InsertContext | null
  rightSidebarOpen: boolean
  setSelectedStep: (step: WorkflowStep | null) => void
  setActions: (actions: WorkflowActions) => void
  setInsertContext: (ctx: InsertContext | null) => void
  setRightSidebarOpen: (open: boolean) => void
}

const WorkflowContext = createContext<WorkflowContextValue>({
  selectedStep: null,
  actions: null,
  insertContext: null,
  rightSidebarOpen: true,
  setSelectedStep: () => {},
  setActions: () => {},
  setInsertContext: () => {},
  setRightSidebarOpen: () => {},
})

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null)
  const [actions, setActions] = useState<WorkflowActions | null>(null)
  const [insertContext, setInsertContext] = useState<InsertContext | null>(null)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  return (
    <WorkflowContext.Provider
      value={{ selectedStep, actions, insertContext, rightSidebarOpen, setSelectedStep, setActions, setInsertContext, setRightSidebarOpen }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflowContext() {
  return useContext(WorkflowContext)
}
