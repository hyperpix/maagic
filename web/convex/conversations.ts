import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAgentAccess } from "./lib/permissions";

export const createConversation = mutation({
  args: {
    widgetKey: v.string(),
    visitorId: v.string(),
  },
  handler: async (ctx, { widgetKey, visitorId }) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_widget_key", (q) => q.eq("widgetKey", widgetKey))
      .first();
    if (!agent) throw new ConvexError("Invalid widget key");

    return ctx.db.insert("conversations", {
      agentId: agent._id,
      visitorId,
      createdAt: Date.now(),
    });
  },
});

export const getConversations = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    await requireAgentAccess(ctx, agentId, "conversation:read");

    return ctx.db
      .query("conversations")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .order("desc")
      .collect();
  },
});

export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    return ctx.db.get(conversationId);
  },
});

export const markConversationOpened = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    await ctx.db.patch(conversationId, { openedAt: Date.now() });
  },
});

export const setHumanMode = mutation({
  args: {
    conversationId: v.id("conversations"),
    humanMode: v.boolean(),
  },
  handler: async (ctx, { conversationId, humanMode }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation?.agentId) throw new ConvexError("Conversation not found");
    await requireAgentAccess(ctx, conversation.agentId, "conversation:reply");
    await ctx.db.patch(conversationId, { humanMode });
  },
});

export const deleteConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation?.agentId) throw new ConvexError("Conversation not found");
    await requireAgentAccess(ctx, conversation.agentId, "conversation:delete");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();

    await Promise.all(messages.map((m) => ctx.db.delete(m._id)));
    await ctx.db.delete(conversationId);
  },
});
