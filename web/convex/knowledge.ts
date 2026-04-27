import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireAgentAccess } from "./lib/permissions";

export const getKnowledgeItems = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    await requireAgentAccess(ctx, agentId, "knowledge:read");

    return ctx.db
      .query("knowledge")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .order("desc")
      .collect();
  },
});

export const createKnowledgeItem = mutation({
  args: {
    agentId: v.id("agents"),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    dataType: v.union(
      v.literal("text"),
      v.literal("sitemap"),
      v.literal("file"),
      v.literal("url")
    ),
  },
  handler: async (ctx, { agentId, ...fields }) => {
    await requireAgentAccess(ctx, agentId, "knowledge:write");

    return ctx.db.insert("knowledge", {
      agentId,
      ...fields,
      createdAt: Date.now(),
    });
  },
});

export const updateKnowledgeItem = mutation({
  args: {
    knowledgeId: v.id("knowledge"),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, { knowledgeId, ...fields }) => {
    const item = await ctx.db.get(knowledgeId);
    if (item?.agentId) {
      await requireAgentAccess(ctx, item.agentId, "knowledge:write");
    }
    await ctx.db.patch(knowledgeId, fields);
  },
});

export const deleteKnowledgeItem = mutation({
  args: { knowledgeId: v.id("knowledge") },
  handler: async (ctx, { knowledgeId }) => {
    const item = await ctx.db.get(knowledgeId);
    if (item?.agentId) {
      await requireAgentAccess(ctx, item.agentId, "knowledge:delete");
    }
    await ctx.db.delete(knowledgeId);
  },
});

// Used internally by the AI action — bypasses auth
export const getKnowledgeItemsInternal = internalQuery({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return ctx.db
      .query("knowledge")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId as any))
      .collect();
  },
});
