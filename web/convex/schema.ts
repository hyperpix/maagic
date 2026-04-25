import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    visitorId: v.string(),
    createdAt: v.number(),
    openedAt: v.optional(v.number()),
    humanMode: v.optional(v.boolean()),
  }),
  messages: defineTable({
    conversationId: v.id("conversations"),
    sender: v.union(v.literal("visitor"), v.literal("agent")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),
  knowledge: defineTable({
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
  }).index("by_created", ["createdAt"]),
  workflows: defineTable({
    nodes: v.string(),
    edges: v.string(),
    name: v.optional(v.string()),
    updatedAt: v.number(),
  }),
  agentConfig: defineTable({
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
  }),
});
