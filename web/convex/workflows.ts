import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWorkflow = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workflows").first();
  },
});

export const saveWorkflow = mutation({
  args: {
    nodes: v.string(),
    edges: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("workflows").first();
    const payload = { nodes: args.nodes, edges: args.edges, name: args.name, updatedAt: Date.now() };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("workflows", payload);
    }
  },
});
