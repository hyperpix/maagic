import {
  Brain,
  Database,
  GitBranch,
  Globe,
  Mail,
  Clock,
  User,
  MessageSquare,
  RefreshCw,
  Zap,
} from "lucide-react"
import type { StepType } from "./types"

export interface StepDefinition {
  type: StepType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "triggers" | "data" | "flow"
  defaultConfig: Record<string, unknown>
  defaultName: string
}

export const STEP_DEFINITIONS: StepDefinition[] = [
  // ── Triggers ──────────────────────────────────────────────────────────────
  {
    type: "trigger",
    label: "Customer Message",
    description: "Starts when a visitor sends a message",
    icon: MessageSquare,
    category: "triggers",
    defaultName: "Customer Message",
    defaultConfig: {},
  },

  // ── Data / Actions ────────────────────────────────────────────────────────
  {
    type: "llm",
    label: "LLM Response",
    description: "Call an AI model to generate a response",
    icon: Brain,
    category: "data",
    defaultName: "LLM Response",
    defaultConfig: { model: "gpt-4o-mini", temperature: 0.7, maxTokens: 1024, systemPrompt: "" },
  },
  {
    type: "knowledge",
    label: "Knowledge Search",
    description: "Search the knowledge base for relevant content",
    icon: Database,
    category: "data",
    defaultName: "Knowledge Search",
    defaultConfig: { maxRetrieve: 3, threshold: 0.5 },
  },
  {
    type: "condition",
    label: "Condition",
    description: "Branch based on a condition",
    icon: GitBranch,
    category: "flow",
    defaultName: "Condition",
    defaultConfig: { expression: "" },
  },
  {
    type: "api",
    label: "API Request",
    description: "Make an HTTP request to an external service",
    icon: Globe,
    category: "data",
    defaultName: "API Request",
    defaultConfig: { url: "", method: "GET", headers: {}, body: "" },
  },
  {
    type: "email",
    label: "Send Email",
    description: "Send an email notification",
    icon: Mail,
    category: "data",
    defaultName: "Send Email",
    defaultConfig: { to: "", subject: "", body: "" },
  },
  {
    type: "delay",
    label: "Delay",
    description: "Wait before continuing",
    icon: Clock,
    category: "flow",
    defaultName: "Delay",
    defaultConfig: { duration: 5, unit: "seconds" },
  },
  {
    type: "human_handoff",
    label: "Human Handoff",
    description: "Escalate conversation to a human agent",
    icon: User,
    category: "data",
    defaultName: "Human Handoff",
    defaultConfig: { message: "This conversation needs human attention." },
  },
  {
    type: "branch",
    label: "Branch",
    description: "Split into multiple parallel paths",
    icon: GitBranch,
    category: "flow",
    defaultName: "Branch",
    defaultConfig: {},
  },
  {
    type: "loop",
    label: "Loop",
    description: "Repeat steps for each item in a list",
    icon: RefreshCw,
    category: "flow",
    defaultName: "Loop",
    defaultConfig: { maxIterations: 10 },
  },
]

export const STEP_DEF_MAP = Object.fromEntries(
  STEP_DEFINITIONS.map((d) => [d.type, d])
) as Record<StepType, StepDefinition>

export const getStepIcon = (type: StepType) =>
  STEP_DEF_MAP[type]?.icon ?? Zap
