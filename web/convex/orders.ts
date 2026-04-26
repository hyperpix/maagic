import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("orders").withIndex("by_created").order("desc").collect();
  },
});

export const createOrder = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("orders", { ...args, createdAt: Date.now() });
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { orderId, status }) => {
    await ctx.db.patch(orderId, { status });
  },
});

export const seedOrders = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("orders").collect();
    if (existing.length > 0) return;
    const seed = [
      { customerId: "c1", customerName: "Emma Wilson",    customerEmail: "emma@example.com",   total: 12800, status: "delivered"  as const, itemCount: 3, createdAt: Date.now() - 86400000 * 0 },
      { customerId: "c2", customerName: "James Carter",   customerEmail: "james@example.com",  total: 7450,  status: "shipped"    as const, itemCount: 1, createdAt: Date.now() - 86400000 * 1 },
      { customerId: "c3", customerName: "Sofia Lee",      customerEmail: "sofia@example.com",  total: 21099, status: "processing" as const, itemCount: 5, createdAt: Date.now() - 86400000 * 1 },
      { customerId: "c4", customerName: "Liam Brown",     customerEmail: "liam@example.com",   total: 3900,  status: "delivered"  as const, itemCount: 2, createdAt: Date.now() - 86400000 * 2 },
      { customerId: "c5", customerName: "Olivia Davis",   customerEmail: "olivia@example.com", total: 31500, status: "cancelled"  as const, itemCount: 4, createdAt: Date.now() - 86400000 * 3 },
      { customerId: "c6", customerName: "Noah Martinez",  customerEmail: "noah@example.com",   total: 8999,  status: "shipped"    as const, itemCount: 2, createdAt: Date.now() - 86400000 * 4 },
      { customerId: "c7", customerName: "Ava Johnson",    customerEmail: "ava@example.com",    total: 5400,  status: "processing" as const, itemCount: 1, createdAt: Date.now() - 86400000 * 5 },
      { customerId: "c8", customerName: "William Garcia", customerEmail: "will@example.com",   total: 43000, status: "delivered"  as const, itemCount: 6, createdAt: Date.now() - 86400000 * 6 },
    ];
    for (const order of seed) await ctx.db.insert("orders", order);
  },
});
