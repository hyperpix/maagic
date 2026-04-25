import OpenAI from "openai"
import { api } from "./_generated/api"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

// ── Types mirrored from frontend ─────────────────────────────────────────────

type StepType =
  | "trigger" | "llm" | "knowledge" | "condition"
  | "api" | "delay" | "email" | "human_handoff" | "branch" | "loop"

interface WorkflowBranch {
  id: string
  name: string
  condition?: string
  steps: WorkflowStep[]
}

interface WorkflowStep {
  id: string
  type: StepType
  name: string
  config: Record<string, unknown>
  branches?: WorkflowBranch[]
}

// ── Execution context ─────────────────────────────────────────────────────────

interface RunCtx {
  convex: any
  conversationId: any
  userMessage: string
  knowledgeContext: string
  accumulatedContext: string
  stepOutputs: Record<string, unknown>
  humanMode: boolean
  finalResponse: string | null
}

// ── Knowledge search ──────────────────────────────────────────────────────────

export async function searchKnowledgeBase(
  ctx: any,
  query: string,
  maxRetrieve = 3
): Promise<string> {
  const allKnowledge = await ctx.runQuery(api.knowledge.getKnowledgeItems)
  if (!allKnowledge || allKnowledge.length === 0) return ""

  const queryLower = query.toLowerCase()
  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of",
    "with","is","are","was","were","what","where","when","why","how",
    "i","you","he","she","it","we","they","this","that","these","those",
  ])
  const keywords = queryLower
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))

  const scored = allKnowledge.map((item: any) => {
    const t = (item.title || "").toLowerCase()
    const d = (item.description || "").toLowerCase()
    const c = (item.content || "").toLowerCase()
    let score = 0
    keywords.forEach((k) => {
      if (t.includes(k)) score += 3
      if (d.includes(k)) score += 2
      if (c.includes(k)) score += 1
    })
    return { item, score }
  })

  const relevant = scored
    .filter(({ score }: any) => score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, maxRetrieve)
    .map(({ item }: any) => item)

  const source = relevant.length > 0 ? relevant : allKnowledge.slice(0, maxRetrieve)
  return source
    .map((item: any) => `## ${item.title}\n${item.description ? item.description + "\n" : ""}${item.content}`)
    .join("\n\n---\n\n")
}

// ── Step executors ────────────────────────────────────────────────────────────

async function runKnowledge(step: WorkflowStep, rc: RunCtx): Promise<void> {
  const maxRetrieve = (step.config.maxRetrieve as number) ?? 3
  const context = await searchKnowledgeBase(rc.convex, rc.userMessage, maxRetrieve)
  rc.knowledgeContext = context
  rc.accumulatedContext += context ? `\n\nKnowledge Base:\n${context}` : ""
}

async function runLLM(
  step: WorkflowStep,
  rc: RunCtx,
  conversationMessages: any[]
): Promise<void> {
  if (!openai) {
    rc.finalResponse = "I'm unable to respond right now. Please try again later."
    return
  }

  const model = (step.config.model as string) || "gpt-4o-mini"
  const temperature = (step.config.temperature as number) ?? 0.7
  const maxTokens = (step.config.maxTokens as number) ?? 1024
  const stepPrompt = (step.config.systemPrompt as string) || ""

  const baseInstructions = await rc.convex.runQuery(api.agentConfig.getAgentConfig)
  const systemInstruction = stepPrompt || baseInstructions?.baseInstructions || "You are a helpful assistant."

  const systemContent = rc.accumulatedContext
    ? `${systemInstruction}\n\nContext:\n${rc.accumulatedContext}`
    : systemInstruction

  const messages = [
    { role: "system" as const, content: systemContent },
    ...conversationMessages,
    { role: "user" as const, content: rc.userMessage },
  ]

  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  })

  rc.finalResponse = completion.choices[0]?.message?.content ?? null
  rc.stepOutputs[step.id] = { response: rc.finalResponse }
}

async function runCondition(step: WorkflowStep, rc: RunCtx): Promise<string | null> {
  const expr = (step.config.expression as string) || ""
  if (!expr) return null

  // Simple evaluator: check if expression references known outputs
  // e.g. "confidence < 0.6" — for now, confidence is hardcoded 0.8 (no embeddings)
  // Returns the branch name to follow, or null for the default path
  const outputs = { ...rc.stepOutputs, confidence: 0.8 }
  try {
    const fn = new Function(...Object.keys(outputs), `return ${expr}`)
    const result = fn(...Object.values(outputs))
    return result ? "true" : "false"
  } catch {
    return null
  }
}

async function runHumanHandoff(step: WorkflowStep, rc: RunCtx): Promise<void> {
  await rc.convex.runMutation(api.conversations.setHumanMode, {
    conversationId: rc.conversationId,
    humanMode: true,
  })
  rc.humanMode = true
  rc.finalResponse =
    (step.config.message as string) ||
    "Let me connect you with a human agent who can help you better."
}

async function runAPIRequest(step: WorkflowStep, rc: RunCtx): Promise<void> {
  const url = step.config.url as string
  if (!url) return

  const method = (step.config.method as string) || "GET"
  const body = step.config.body as string | undefined

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body && method !== "GET" ? body : undefined,
    })
    const text = await res.text()
    rc.stepOutputs[step.id] = { status: res.status, body: text }
    rc.accumulatedContext += `\n\nAPI Response (${step.name}):\n${text.slice(0, 500)}`
  } catch (e: any) {
    rc.stepOutputs[step.id] = { error: e.message }
  }
}

// ── Chain runner ──────────────────────────────────────────────────────────────

export async function runWorkflowChain(
  steps: WorkflowStep[],
  rc: RunCtx,
  conversationMessages: any[]
): Promise<void> {
  for (const step of steps) {
    if (rc.humanMode || rc.finalResponse) break

    switch (step.type) {
      case "trigger":
        break // no-op: message already captured

      case "knowledge":
        await runKnowledge(step, rc)
        break

      case "llm":
        await runLLM(step, rc, conversationMessages)
        break

      case "condition": {
        const result = await runCondition(step, rc)
        rc.stepOutputs[step.id] = { result }
        break
      }

      case "branch": {
        const branches = step.branches ?? []
        let matched: WorkflowBranch | undefined

        for (const branch of branches) {
          if (!branch.condition) {
            matched = branch
            break
          }
          const outputs = { ...rc.stepOutputs, confidence: 0.8 }
          try {
            const fn = new Function(...Object.keys(outputs), `return ${branch.condition}`)
            if (fn(...Object.values(outputs))) {
              matched = branch
              break
            }
          } catch {
            // invalid expression — skip
          }
        }

        if (matched && matched.steps.length > 0) {
          await runWorkflowChain(matched.steps, rc, conversationMessages)
        }
        break
      }

      case "human_handoff":
        await runHumanHandoff(step, rc)
        break

      case "api":
        await runAPIRequest(step, rc)
        break

      case "delay":
        // In a real async system we'd schedule a job; skip for now
        break

      case "loop":
        // Basic: run children once (full loop support is a future feature)
        break

      case "email":
        // TODO: integrate email provider
        break
    }
  }
}
