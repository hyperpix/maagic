import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getCurrentUserId, requireMember, requirePermission } from "./lib/permissions";

export const getMembers = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requirePermission(ctx, orgId, "member:read");

    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();

    const members = await Promise.all(
      memberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return user ? { ...m, email: user.email, name: user.name, image: user.image } : null;
      })
    );

    return members.filter(Boolean);
  },
});

export const inviteMember = mutation({
  args: {
    orgId: v.id("organizations"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, { orgId, email, role }) => {
    const inviter = await requirePermission(ctx, orgId, "member:invite");

    // Revoke any existing pending invite for this email+org
    const existing = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    for (const inv of existing) {
      if (inv.orgId === orgId && !inv.acceptedAt) {
        await ctx.db.delete(inv._id);
      }
    }

    const token = crypto.randomUUID();
    await ctx.db.insert("invitations", {
      email,
      orgId,
      role,
      token,
      invitedBy: inviter.userId,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
  },
});

export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const userId = await getCurrentUserId(ctx);

    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();

    if (!invitation) throw new ConvexError("Invalid invitation");
    if (invitation.acceptedAt) throw new ConvexError("Invitation already accepted");
    if (invitation.expiresAt < Date.now()) throw new ConvexError("Invitation has expired");

    // Check not already a member
    const existing = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", userId).eq("orgId", invitation.orgId)
      )
      .first();
    if (existing) throw new ConvexError("Already a member of this organization");

    await ctx.db.insert("organizationMembers", {
      userId,
      orgId: invitation.orgId,
      role: invitation.role,
      joinedAt: Date.now(),
    });

    await ctx.db.patch(invitation._id, { acceptedAt: Date.now() });

    const org = await ctx.db.get(invitation.orgId);
    return org?.slug ?? "";
  },
});

export const updateMemberRole = mutation({
  args: {
    orgId: v.id("organizations"),
    targetUserId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, { orgId, targetUserId, role }) => {
    await requirePermission(ctx, orgId, "member:update_role");

    const target = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", targetUserId).eq("orgId", orgId)
      )
      .first();

    if (!target) throw new ConvexError("Member not found");

    // Guard: cannot demote the last owner
    if (target.role === "owner" && role !== "owner") {
      const owners = await ctx.db
        .query("organizationMembers")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .collect();
      const ownerCount = owners.filter((m) => m.role === "owner").length;
      if (ownerCount <= 1) throw new ConvexError("Cannot demote the last owner");
    }

    await ctx.db.patch(target._id, { role });
  },
});

export const removeMember = mutation({
  args: {
    orgId: v.id("organizations"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, { orgId, targetUserId }) => {
    const callerUserId = await getCurrentUserId(ctx);
    const isSelf = callerUserId === targetUserId;

    if (!isSelf) {
      await requirePermission(ctx, orgId, "member:remove");
    }

    const target = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user_and_org", (q) =>
        q.eq("userId", targetUserId).eq("orgId", orgId)
      )
      .first();

    if (!target) throw new ConvexError("Member not found");

    // Guard: last owner cannot leave
    if (target.role === "owner") {
      const owners = await ctx.db
        .query("organizationMembers")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .collect();
      const ownerCount = owners.filter((m) => m.role === "owner").length;
      if (ownerCount <= 1) throw new ConvexError("Cannot remove the last owner. Transfer ownership first.");
    }

    await ctx.db.delete(target._id);
  },
});

export const getPendingInvitations = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    await requirePermission(ctx, orgId, "member:read");

    return ctx.db
      .query("invitations")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("acceptedAt"), undefined))
      .collect();
  },
});
