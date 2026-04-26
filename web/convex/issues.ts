import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getIssues = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("issues").withIndex("by_created").order("desc").collect();
  },
});

export const createIssue = mutation({
  args: {
    title: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("issues", { ...args, createdAt: Date.now() });
  },
});

export const updateIssueStatus = mutation({
  args: {
    issueId: v.id("issues"),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
  },
  handler: async (ctx, { issueId, status }) => {
    await ctx.db.patch(issueId, { status });
  },
});
