import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "is", "are", "was", "were", "what", "where", "when", "why", "how",
  "i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those",
]);

async function searchKnowledgeBase(
  ctx: any,
  userQuery: string,
  agentId: string
): Promise<Array<{ title: string; description: string; content: string }>> {
  // Use internal query to bypass auth — the AI action is server-side trusted
  const allKnowledge: any[] = await ctx.runQuery(internal.knowledge.getKnowledgeItemsInternal, { agentId });
  if (!allKnowledge || allKnowledge.length === 0) return [];

  const queryLower = userQuery.toLowerCase();
  const queryWords = queryLower
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (queryWords.length === 0) {
    return allKnowledge.slice(0, 5).map((item) => ({
      title: item.title,
      description: item.description ?? "",
      content: item.content,
    }));
  }

  const scored = allKnowledge.map((item) => {
    const title = (item.title ?? "").toLowerCase();
    const description = (item.description ?? "").toLowerCase();
    const content = (item.content ?? "").toLowerCase();

    let score = 0;
    for (const word of queryWords) {
      if (title.includes(word)) score += 3;
      if (description.includes(word)) score += 2;
      if (content.includes(word)) score += 1;
    }
    for (const word of [...title.split(/\s+/), ...description.split(/\s+/)].filter((w) => w.length > 2)) {
      if (queryLower.includes(word)) score += 2;
    }
    return { item, score };
  });

  const relevant = scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return (relevant.length > 0 ? relevant : allKnowledge).slice(0, 5).map((item) => ({
    title: item.title,
    description: item.description ?? "",
    content: item.content,
  }));
}

export const generateAIResponse = action({
  args: {
    conversationId: v.id("conversations"),
    userMessage: v.string(),
  },
  handler: async (ctx, { conversationId, userMessage }) => {
    const conversation = await ctx.runQuery(api.conversations.getConversation, { conversationId });
    if (!conversation || conversation.humanMode) return null;

    const agentId = conversation.agentId;
    if (!agentId) return null;

    const [agentConfig, knowledgeContext, messages] = await Promise.all([
      ctx.runQuery((internal as any).agents.getAgentConfigInternal, { agentId }),
      searchKnowledgeBase(ctx, userMessage, agentId),
      ctx.runQuery(api.messages.getMessages, { conversationId }),
    ]);

    const fallback = "I don't know. This information is not available in my knowledge base.";

    const contextText = knowledgeContext
      .map((item: any) => `Title: ${item.title}\nDescription: ${item.description}\nContent: ${item.content}`)
      .join("\n\n---\n\n");

    const baseInstructions = agentConfig?.baseInstructions ?? "";
    const systemPrompt = contextText.length > 0
      ? `You are a helpful assistant.${baseInstructions ? ` ${baseInstructions}` : ""} Answer questions based on the provided knowledge base context below.\n\nIMPORTANT RULES:\n1. Use the knowledge base context to answer the user's question.\n2. If the answer can be derived from the context, provide a helpful answer.\n3. Only if the question is completely unrelated, say: "${fallback}"\n4. Be helpful, concise, and natural.\n\nKnowledge Base Context:\n${contextText}`
      : `You are a helpful assistant.${baseInstructions ? ` ${baseInstructions}` : ""} The knowledge base is currently empty. Respond with: "${fallback}"`;

    const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...(messages as any[]).slice(-10).map((msg: any) => ({
        role: (msg.sender === "visitor" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const save = (content: string) =>
      ctx.runMutation(api.messages.sendMessage, { conversationId, sender: "agent", content });

    if (!openai) {
      await save(fallback);
      return fallback;
    }

    try {
      const completion: any = await openai.chat.completions.create({
        model: agentConfig?.model ?? "gpt-4o-mini",
        messages: chatMessages,
        temperature: agentConfig?.temperature ?? 0.7,
        max_tokens: agentConfig?.maxTokens ?? 500,
      });

      const response: string = completion.choices[0]?.message?.content ?? fallback;
      await save(response);
      return response;
    } catch (error) {
      console.error("OpenAI API error:", error);
      await save(fallback);
      return fallback;
    }
  },
});
