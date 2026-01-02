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
});
