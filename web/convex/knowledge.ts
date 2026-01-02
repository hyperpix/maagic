import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getKnowledgeItems = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("knowledge").order("desc").collect();
  },
});

export const createKnowledgeItem = mutation({
  args: {
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
  handler: async (ctx: any, args: {
    title: string;
    description?: string;
    content: string;
    dataType: "text" | "sitemap" | "file" | "url";
  }) => {
    const knowledgeId = await ctx.db.insert("knowledge", {
      title: args.title,
      description: args.description,
      content: args.content,
      dataType: args.dataType,
      createdAt: Date.now(),
    });
    return knowledgeId;
  },
});

export const deleteKnowledgeItem = mutation({
  args: { knowledgeId: v.id("knowledge") },
  handler: async (ctx: any, args: { knowledgeId: any }) => {
    await ctx.db.delete(args.knowledgeId);
  },
});

export const updateKnowledgeItem = mutation({
  args: {
    knowledgeId: v.id("knowledge"),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx: any, args: {
    knowledgeId: any;
    title: string;
    description?: string;
    content: string;
  }) => {
    await ctx.db.patch(args.knowledgeId, {
      title: args.title,
      description: args.description,
      content: args.content,
    });
  },
});

