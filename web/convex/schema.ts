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
  issues: defineTable({
    title: v.string(),
    customerName: v.string(),
    customerEmail: v.optional(v.string()),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  integrations: defineTable({
    type: v.union(
      v.literal("shopify"),
      v.literal("woocommerce"),
      v.literal("postgres"),
      v.literal("rest_api")
    ),
    name: v.string(),
    config: v.string(), // JSON-encoded credentials
    active: v.boolean(),
    createdAt: v.number(),
  }),

  orders: defineTable({
    customerId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    total: v.number(),
    status: v.union(
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    itemCount: v.number(),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  items: defineTable({
    name: v.string(),
    sku: v.string(),
    category: v.string(),
    price: v.number(),
    stock: v.number(),
    status: v.union(
      v.literal("in_stock"),
      v.literal("low_stock"),
      v.literal("out_of_stock")
    ),
  }).index("by_sku", ["sku"]),

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
    baseInstructions: v.optional(v.string()),
    model: v.optional(v.string()),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
    greetingMessage: v.optional(v.string()),
  }),
});
