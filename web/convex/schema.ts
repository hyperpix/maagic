import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }).index("by_slug", ["slug"]),

  organizationMembers: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_and_org", ["userId", "orgId"]),

  invitations: defineTable({
    email: v.string(),
    orgId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
    token: v.string(),
    invitedBy: v.id("users"),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_org", ["orgId"])
    .index("by_email", ["email"]),

  agents: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    widgetKey: v.string(),
    createdAt: v.number(),
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
    legalLinks: v.optional(
      v.array(v.object({ label: v.string(), url: v.string() }))
    ),
    greetingMessage: v.optional(v.string()),
    baseInstructions: v.optional(v.string()),
    model: v.optional(v.string()),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .index("by_org_and_slug", ["orgId", "slug"])
    .index("by_widget_key", ["widgetKey"]),

  conversations: defineTable({
    agentId: v.optional(v.id("agents")),
    visitorId: v.string(),
    createdAt: v.number(),
    openedAt: v.optional(v.number()),
    humanMode: v.optional(v.boolean()),
  }).index("by_agent", ["agentId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    sender: v.union(v.literal("visitor"), v.literal("agent")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  knowledge: defineTable({
    agentId: v.optional(v.id("agents")),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    dataType: v.union(
      v.literal("text"),
      v.literal("sitemap"),
      v.literal("file"),
      v.literal("url")
    ),
    createdAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_created", ["createdAt"]),
});
