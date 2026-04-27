import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAgentAccess, requirePermission } from "./lib/permissions";

function generateWidgetKey(): string {
  return `wk_${crypto.randomUUID().replace(/-/g, "")}`;
}

export const createAgent = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, { orgId, name, slug }) => {
    await requirePermission(ctx, orgId, "agent:create");

    const existing = await ctx.db
      .query("agents")
      .withIndex("by_org_and_slug", (q) => q.eq("orgId", orgId).eq("slug", slug))
      .first();
    if (existing) throw new ConvexError("An agent with this slug already exists in the organization");

    return ctx.db.insert("agents", {
      orgId,
      name,
      slug,
      widgetKey: generateWidgetKey(),
      createdAt: Date.now(),
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 500,
      greetingMessage: "Hi! How can I help you today?",
    });
  },
});

export const getAgents = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requirePermission(ctx, orgId, "agent:read");

    return ctx.db
      .query("agents")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const getAgentBySlug = query({
  args: { orgId: v.id("organizations"), slug: v.string() },
  handler: async (ctx, { orgId, slug }) => {
    await requirePermission(ctx, orgId, "agent:read");

    return ctx.db
      .query("agents")
      .withIndex("by_org_and_slug", (q) => q.eq("orgId", orgId).eq("slug", slug))
      .first();
  },
});

export const getAgentByWidgetKey = query({
  args: { widgetKey: v.string() },
  handler: async (ctx, { widgetKey }) => {
    return ctx.db
      .query("agents")
      .withIndex("by_widget_key", (q) => q.eq("widgetKey", widgetKey))
      .first();
  },
});

export const updateAgent = mutation({
  args: {
    agentId: v.id("agents"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
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
    greetingMessage: v.optional(v.string()),
    baseInstructions: v.optional(v.string()),
    model: v.optional(v.string()),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
  },
  handler: async (ctx, { agentId, ...updates }) => {
    const { agent } = await requireAgentAccess(ctx, agentId, "agent:update");

    if (updates.slug && updates.slug !== agent.slug) {
      const existing = await ctx.db
        .query("agents")
        .withIndex("by_org_and_slug", (q) =>
          q.eq("orgId", agent.orgId).eq("slug", updates.slug!)
        )
        .first();
      if (existing) throw new ConvexError("An agent with this slug already exists");
    }

    const fields = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(agentId, fields);
  },
});

export const deleteAgent = mutation({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    await requireAgentAccess(ctx, agentId, "agent:delete");
    await ctx.db.delete(agentId);
  },
});

export const rotateWidgetKey = mutation({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    await requireAgentAccess(ctx, agentId, "agent:update");
    const newKey = generateWidgetKey();
    await ctx.db.patch(agentId, { widgetKey: newKey });
    return newKey;
  },
});

// Used internally by the AI action — no auth required
export const getAgentConfigInternal = internalQuery({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    return ctx.db.get(agentId);
  },
});
