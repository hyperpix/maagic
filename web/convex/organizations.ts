import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserId, requirePermission } from "./lib/permissions";
import { ConvexError } from "convex/values";

export const createOrg = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, { name, slug }) => {
    const userId = await getCurrentUserId(ctx);

    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) throw new ConvexError("An organization with this slug already exists");

    const orgId = await ctx.db.insert("organizations", {
      name,
      slug,
      createdAt: Date.now(),
      createdBy: userId,
    });

    await ctx.db.insert("organizationMembers", {
      userId,
      orgId,
      role: "owner",
      joinedAt: Date.now(),
    });

    return orgId;
  },
});

export const getMyOrgs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);

    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const orgs = await Promise.all(
      memberships.map(async (m) => {
        const org = await ctx.db.get(m.orgId);
        return org ? { ...org, role: m.role } : null;
      })
    );

    return orgs.filter(Boolean);
  },
});

export const getOrgBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const updateOrg = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, { orgId, ...updates }) => {
    await requirePermission(ctx, orgId, "org:update");
    const fields = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(orgId, fields);
  },
});
