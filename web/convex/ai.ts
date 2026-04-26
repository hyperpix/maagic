import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";
import { runWorkflowChain, searchKnowledgeBase as searchKB } from "./workflowRunner";
import { graphToSteps } from "./graphToSteps";

// Initialize OpenAI client
// Make sure to set OPENAI_API_KEY in your Convex environment variables
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// Search knowledge base for relevant content
async function searchKnowledgeBase(ctx: any, query: string): Promise<Array<{ title: string; description: string; content: string }>> {
  const allKnowledge = await ctx.runQuery(api.knowledge.getKnowledgeItems);
  
  if (!allKnowledge || allKnowledge.length === 0) {
    return [];
  }

  // Extract keywords from query (remove common words)
  const queryLower = query.toLowerCase();
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'what', 'where', 'when', 'why', 'how', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those'];
  const queryWords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  // If no meaningful keywords, return all knowledge items
  if (queryWords.length === 0) {
    return allKnowledge.map((item: any) => ({
      title: item.title,
      description: item.description || "",
      content: item.content,
    }));
  }

  // Score each knowledge item based on keyword matches
  const scoredItems = allKnowledge.map((item: any) => {
    const title = (item.title || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const content = (item.content || "").toLowerCase();
    
    let score = 0;
    queryWords.forEach(word => {
      if (title.includes(word)) score += 3; // Title matches are most important
      if (description.includes(word)) score += 2; // Description matches are important
      if (content.includes(word)) score += 1; // Content matches are less important
    });
    
    // Also check if query contains words from title/description (reverse match)
    const itemWords = [...title.split(/\s+/), ...description.split(/\s+/)].filter(w => w.length > 2);
    itemWords.forEach(word => {
      if (queryLower.includes(word)) score += 2;
    });

    return { item, score };
  });

  // Filter items with score > 0 and sort by score (highest first)
  const relevantItems = scoredItems
    .filter(({ score }: { score: number }) => score > 0)
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .map(({ item }: { item: any }) => item);

  // If no matches found, return all items (fallback to show all knowledge)
  if (relevantItems.length === 0) {
    return allKnowledge.map((item: any) => ({
      title: item.title,
      description: item.description || "",
      content: item.content,
    }));
  }

  // Return top 5 most relevant items
  return relevantItems.slice(0, 5).map((item: any) => ({
    title: item.title,
    description: item.description || "",
    content: item.content,
  }));
}

export const generateAIResponse = action({
  args: {
    conversationId: v.id("conversations"),
    userMessage: v.string(),
  },
  handler: async (ctx: any, args: { conversationId: any; userMessage: string }) => {
    const conversation = await ctx.runQuery(api.conversations.getConversation, {
      conversationId: args.conversationId,
    });

    if (conversation?.humanMode) return null;

    // Load saved workflow
    const savedWorkflow = await ctx.runQuery(api.workflows.getWorkflow);
    let steps: ReturnType<typeof graphToSteps> = [];

    if (savedWorkflow?.nodes) {
      try {
        const parsedNodes = JSON.parse(savedWorkflow.nodes);
        const parsedEdges = JSON.parse(savedWorkflow.edges ?? "[]");
        // Only use if it looks like a ReactFlow node array (has 'position' field)
        if (Array.isArray(parsedNodes) && parsedNodes[0]?.position) {
          steps = graphToSteps(parsedNodes, parsedEdges);
        }
      } catch {
        // fall through to default
      }
    }

    const conversationMessages: any[] = await ctx.runQuery(api.messages.getMessages, {
      conversationId: args.conversationId,
    });

    const fallback = "I'm sorry, I'm unable to respond right now. Please try again later.";

    if (steps.length === 0) {
      // No workflow configured — use legacy inline path
      if (!openai) {
        await ctx.runMutation(api.messages.sendMessage, {
          conversationId: args.conversationId,
          sender: "agent",
          content: fallback,
        });
        return fallback;
      }

      const knowledgeContext: string = await searchKB(ctx, args.userMessage);
      const contextText = knowledgeContext;

      const systemPrompt = contextText
        ? `You are a helpful assistant.\n\nKnowledge Base:\n${contextText}`
        : "You are a helpful assistant.";

      const msgs = [
        { role: "system" as const, content: systemPrompt },
        ...conversationMessages.slice(-10).map((m: any) => ({
          role: (m.sender === "visitor" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: args.userMessage },
      ];

      try {
        const completion: any = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: msgs,
          temperature: 0.7,
          max_tokens: 500,
        });
        const response = completion.choices[0]?.message?.content || fallback;
        await ctx.runMutation(api.messages.sendMessage, {
          conversationId: args.conversationId,
          sender: "agent",
          content: response,
        });
        return response;
      } catch {
        await ctx.runMutation(api.messages.sendMessage, {
          conversationId: args.conversationId,
          sender: "agent",
          content: fallback,
        });
        return fallback;
      }
    }

    // Run the configured workflow
    const rc = {
      convex: ctx,
      conversationId: args.conversationId,
      userMessage: args.userMessage,
      knowledgeContext: "",
      accumulatedContext: "",
      stepOutputs: {} as Record<string, unknown>,
      humanMode: false,
      finalResponse: null as string | null,
    };

    await runWorkflowChain(steps as any, rc, conversationMessages.slice(-10).map((m: any) => ({
      role: m.sender === "visitor" ? "user" : "assistant",
      content: m.content,
    })));

    const response = rc.finalResponse ?? fallback;

    await ctx.runMutation(api.messages.sendMessage, {
      conversationId: args.conversationId,
      sender: "agent",
      content: response,
    });

    return response;
  },
});

