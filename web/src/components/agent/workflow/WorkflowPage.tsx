"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Provider, Editor } from "@inngest/workflow-kit/ui"
import "@inngest/workflow-kit/ui/ui.css"
import "./workflow-canvas.css"
import type { Workflow, PublicEngineAction } from "@inngest/workflow-kit"
import { Loader2 } from "lucide-react"
import { WorkflowFloatingPanel } from "./WorkflowFloatingPanel"

const AVAILABLE_ACTIONS: PublicEngineAction[] = [
  {
    kind: "llm",
    name: "LLM Response",
    description: "Generate a response using an AI model",
  },
  {
    kind: "knowledge",
    name: "Knowledge Search",
    description: "Search the knowledge base for relevant content",
  },
  {
    kind: "condition",
    name: "Condition",
    description: "Branch the workflow based on a condition",
  },
  {
    kind: "api",
    name: "API Request",
    description: "Make an HTTP request to an external service",
  },
  {
    kind: "email",
    name: "Send Email",
    description: "Send an email notification",
  },
  {
    kind: "delay",
    name: "Delay",
    description: "Wait before continuing to the next step",
  },
  {
    kind: "human_handoff",
    name: "Human Handoff",
    description: "Escalate the conversation to a human agent",
  },
]

const DEFAULT_WORKFLOW: Workflow = {
  name: "Agent Workflow",
  actions: [
    {
      id: "knowledge-default",
      kind: "knowledge",
      name: "Knowledge Search",
      inputs: { maxRetrieve: 3 },
    },
    {
      id: "llm-default",
      kind: "llm",
      name: "LLM Response",
      inputs: { model: "gpt-4o-mini", temperature: 0.7 },
    },
  ],
  edges: [{ from: "knowledge-default", to: "llm-default" }],
}

const TRIGGER = { event: { name: "customer.message" } }

export function WorkflowPage() {
  const [workflow, setWorkflow] = useState<Workflow>(DEFAULT_WORKFLOW)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const savedWorkflow = useQuery(api.workflows.getWorkflow)
  const saveWorkflow = useMutation(api.workflows.saveWorkflow)

  useEffect(() => {
    if (savedWorkflow && !loaded) {
      try {
        const parsed: Workflow = JSON.parse(savedWorkflow.nodes)
        if (parsed && Array.isArray(parsed.actions)) {
          setWorkflow(parsed)
        }
      } catch { /* ignore */ }
      setLoaded(true)
    } else if (savedWorkflow === null && !loaded) {
      setLoaded(true)
    }
  }, [savedWorkflow, loaded])

  const handleChange = useCallback(
    (w: Workflow) => {
      setWorkflow(w)
      if (!loaded) return
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        setSaving(true)
        try {
          await saveWorkflow({ nodes: JSON.stringify(w), edges: "[]" })
        } finally {
          setSaving(false)
        }
      }, 1500)
    },
    [loaded, saveWorkflow]
  )

  return (
    <div className="relative w-full h-full">
      {saving && (
        <div className="absolute top-3 left-3 z-50 flex items-center gap-2 text-xs text-muted-foreground bg-background border rounded-lg px-3 py-1.5 shadow-sm">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </div>
      )}
      <Provider
        workflow={workflow}
        trigger={TRIGGER}
        availableActions={AVAILABLE_ACTIONS}
        onChange={handleChange}
      >
        <Editor direction="down" />
        <WorkflowFloatingPanel />
      </Provider>
    </div>
  )
}
