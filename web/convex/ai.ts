import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";

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
    // Check if human mode is enabled for this conversation
    const conversation = await ctx.runQuery(api.conversations.getConversation, {
      conversationId: args.conversationId,
    });

    // If human mode is enabled, don't generate AI response
    if (conversation?.humanMode) {
      return null;
    }

    // Search knowledge base for relevant context
    const knowledgeContext = await searchKnowledgeBase(ctx, args.userMessage);
    
    // Build context string from knowledge base
    let contextText = "";
    if (knowledgeContext.length > 0) {
      contextText = knowledgeContext
        .map((item: { title: string; description: string; content: string }) => `Title: ${item.title}\nDescription: ${item.description}\nContent: ${item.content}`)
        .join("\n\n---\n\n");
    }

    // Get conversation history
    const messages: any[] = await ctx.runQuery(api.messages.getMessages, {
      conversationId: args.conversationId,
    });

    // Build messages array for OpenAI
    const hasContext = contextText.length > 0;
    
    const systemPrompt = hasContext 
      ? `You are a helpful assistant. Answer questions based on the provided knowledge base context below.

IMPORTANT RULES:
1. Use the knowledge base context to answer the user's question.
2. If the answer can be derived from the context (even partially), provide a helpful answer.
3. You can infer and explain information based on what's in the context.
4. Only if the question is completely unrelated to the context, say: "I don't know. This information is not available in my knowledge base."
5. Be helpful, concise, and natural in your responses.

Knowledge Base Context:
${contextText}`
      : `You are a helpful assistant. The knowledge base is currently empty.

IMPORTANT RULES:
1. Since there is no knowledge base content available, respond with: "I don't know. This information is not available in my knowledge base."
2. Be polite and helpful in your response.`;

    const conversationMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10).map((msg: any) => ({
        role: (msg.sender === "visitor" ? "user" : "assistant") as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: args.userMessage },
    ];

    if (!openai) {
      const errorResponse = "I don't know. This information is not available in my knowledge base.";
      await ctx.runMutation(api.messages.sendMessage, {
        conversationId: args.conversationId,
        sender: "agent",
        content: errorResponse,
      });
      return errorResponse;
    }

    try {
      const completion: any = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using gpt-4o-mini (nano equivalent)
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiResponse: string = completion.choices[0]?.message?.content || "I don't know. This information is not available in my knowledge base.";

      // Save the AI response as a message
      await ctx.runMutation(api.messages.sendMessage, {
        conversationId: args.conversationId,
        sender: "agent",
        content: aiResponse,
      });

      return aiResponse;
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback response
      const fallbackResponse = "I don't know. This information is not available in my knowledge base.";
      await ctx.runMutation(api.messages.sendMessage, {
        conversationId: args.conversationId,
        sender: "agent",
        content: fallbackResponse,
      });
      return fallbackResponse;
    }
  },
});

