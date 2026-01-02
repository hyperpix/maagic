import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAgentConfigInternal = async (ctx: any) => {
  return await ctx.db.query("agentConfig").first();
};

export const getAgentConfig = query({
  args: {},
  handler: getAgentConfigInternal,
});

export const updateAgentConfigInternal = async (ctx: any, args: any) => {
  const existingConfig = await ctx.db.query("agentConfig").first();

  if (existingConfig) {
    await ctx.db.patch(existingConfig._id, args);
  } else {
    await ctx.db.insert("agentConfig", args);
  }
};

export const updateAgentConfig = mutation({
  args: {
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    headerImage: v.optional(v.string()),
    backgroundImage: v.optional(v.string()),
    font: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    enableTabs: v.optional(v.boolean()),
    privacyDisclaimer: v.optional(v.string()),
    legalLinks: v.optional(v.array(v.object({ label: v.string(), url: v.string() }))),
  },
  handler: updateAgentConfigInternal,
});