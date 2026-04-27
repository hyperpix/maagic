import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";
import { Id } from "../_generated/dataModel";

export type Role = "owner" | "admin" | "member";

export type Permission =
  | "org:read" | "org:update" | "org:delete"
  | "member:read" | "member:invite" | "member:update_role" | "member:remove"
  | "agent:create" | "agent:read" | "agent:update" | "agent:delete"
  | "knowledge:read" | "knowledge:write" | "knowledge:delete"
  | "conversation:read" | "conversation:reply" | "conversation:delete"
  | "analytics:read";

const ALL_PERMISSIONS: Permission[] = [
  "org:read", "org:update", "org:delete",
  "member:read", "member:invite", "member:update_role", "member:remove",
  "agent:create", "agent:read", "agent:update", "agent:delete",
  "knowledge:read", "knowledge:write", "knowledge:delete",
  "conversation:read", "conversation:reply", "conversation:delete",
  "analytics:read",
];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS.filter((p) => p !== "org:delete"),
  member: [
    "org:read",
    "member:read",
    "agent:read",
    "knowledge:read",
    "knowledge:write",
    "conversation:read",
    "conversation:reply",
    "analytics:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

type AuthCtx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

export async function requireMember(ctx: AuthCtx, orgId: Id<"organizations">) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("Unauthenticated");

  const member = await ctx.db
    .query("organizationMembers")
    .withIndex("by_user_and_org", (q) => q.eq("userId", userId).eq("orgId", orgId))
    .first();

  if (!member) throw new ConvexError("Not a member of this organization");
  return member;
}

export async function requirePermission(
  ctx: AuthCtx,
  orgId: Id<"organizations">,
  permission: Permission
) {
  const member = await requireMember(ctx, orgId);
  if (!hasPermission(member.role as Role, permission)) {
    throw new ConvexError(`Forbidden: missing permission '${permission}'`);
  }
  return member;
}

export async function requireAgentAccess(
  ctx: AuthCtx,
  agentId: Id<"agents">,
  permission: Permission
) {
  const agent = await ctx.db.get(agentId);
  if (!agent) throw new ConvexError("Agent not found");
  const member = await requirePermission(ctx, agent.orgId, permission);
  return { member, agent };
}

export async function getCurrentUserId(ctx: AuthCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("Unauthenticated");
  return userId;
}
