import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAgentAccess } from "./lib/permissions";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) return [];
    const userId = await getAuthUserId(ctx);
    if (userId && conversation.agentId) {
      await requireAgentAccess(ctx, conversation.agentId, "conversation:read");
    }
    return ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();
  },
});

export const getAllMessages = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    await requireAgentAccess(ctx, agentId, "analytics:read");

    return ctx.db
      .query("messages")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    sender: v.union(v.literal("visitor"), v.literal("agent")),
    content: v.string(),
  },
  handler: async (ctx, { conversationId, sender, content }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) throw new ConvexError("Conversation not found");

    if (sender === "agent") {
      if (!conversation.agentId) throw new ConvexError("Conversation not found");
      await requireAgentAccess(ctx, conversation.agentId, "conversation:reply");
    }

    return ctx.db.insert("messages", {
      conversationId,
      agentId: conversation.agentId,
      sender,
      content,
      createdAt: Date.now(),
    });
  },
});
