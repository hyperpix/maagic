import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const integrationType = v.union(
  v.literal("shopify"),
  v.literal("woocommerce"),
  v.literal("postgres"),
  v.literal("rest_api")
);

export const getIntegrations = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("integrations").collect();
  },
});

export const getActiveIntegration = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("integrations")
      .filter((q) => q.eq(q.field("active"), true))
      .first();
  },
});

export const saveIntegration = mutation({
  args: {
    type: integrationType,
    name: v.string(),
    config: v.string(),
  },
  handler: async (ctx, args) => {
    // deactivate existing of same type
    const existing = await ctx.db
      .query("integrations")
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { config: args.config, name: args.name, active: true, createdAt: Date.now() });
      return existing._id;
    }
    return ctx.db.insert("integrations", { ...args, active: true, createdAt: Date.now() });
  },
});

export const setActiveIntegration = mutation({
  args: { id: v.id("integrations") },
  handler: async (ctx, { id }) => {
    const all = await ctx.db.query("integrations").collect();
    for (const i of all) await ctx.db.patch(i._id, { active: i._id === id });
  },
});

export const deleteIntegration = mutation({
  args: { id: v.id("integrations") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
