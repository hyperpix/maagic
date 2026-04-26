"use client"

import React, { useEffect } from "react"
import { StepPicker } from "./step-picker"
import { StepConfig } from "./step-config"
import { useWorkflowContext } from "./WorkflowContext"
import type { StepType } from "./types"

export function CanvasRightSidebar() {
  const {
    selectedStep,
    actions,
    insertContext,
    setInsertContext,
    rightSidebarOpen,
    setRightSidebarOpen,
  } = useWorkflowContext()

  useEffect(() => {
    if (selectedStep || insertContext) setRightSidebarOpen(true)
  }, [selectedStep, insertContext, setRightSidebarOpen])

  if (!rightSidebarOpen) return null

  const showPicker = !!insertContext || !selectedStep

  const handlePickerSelect = (type: StepType) => {
    if (insertContext) {
      actions?.insertStepAfter(insertContext.sourceId, insertContext.targetId, type)
      setInsertContext(null)
    } else {
      actions?.addStep(type)
    }
  }

  const handlePickerBranch = () => {
    if (insertContext) {
      actions?.insertBranchAfter(insertContext.sourceId, insertContext.targetId)
      setInsertContext(null)
    } else {
      actions?.addBranch()
    }
  }

  const handlePickerClose = () => {
    setInsertContext(null)
    actions?.clearSelection()
    setRightSidebarOpen(false)
  }

  return (
    <div className="flex h-full w-[16rem] shrink-0 flex-col bg-sidebar text-sidebar-foreground overflow-hidden">
      {!showPicker && selectedStep && actions ? (
        <StepConfig
          step={selectedStep}
          onUpdateConfig={(cfg) => actions.updateSelectedConfig(cfg)}
          onUpdateName={(name) => actions.updateSelectedName(name)}
          onDelete={selectedStep.type !== "trigger" ? actions.deleteSelected : undefined}
          onClose={actions.clearSelection}
        />
      ) : (
        <StepPicker
          onSelect={handlePickerSelect}
          onAddBranch={handlePickerBranch}
          onClose={handlePickerClose}
        />
      )}
    </div>
  )
}
