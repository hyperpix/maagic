import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("items").collect();
  },
});

export const createItem = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("items", args);
  },
});

export const updateItemStock = mutation({
  args: {
    itemId: v.id("items"),
    stock: v.number(),
    status: v.union(
      v.literal("in_stock"),
      v.literal("low_stock"),
      v.literal("out_of_stock")
    ),
  },
  handler: async (ctx, { itemId, stock, status }) => {
    await ctx.db.patch(itemId, { stock, status });
  },
});

export const seedItems = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("items").collect();
    if (existing.length > 0) return;
    const seed = [
      { name: "Wireless Headphones Pro",  sku: "WHP-9001", category: "Electronics", price: 12900, stock: 42,  status: "in_stock"     as const },
      { name: "Leather Wallet Slim",       sku: "LWS-4420", category: "Accessories", price: 4900,  stock: 18,  status: "in_stock"     as const },
      { name: "Portable Charger 20k",      sku: "PCH-2000", category: "Electronics", price: 5999,  stock: 0,   status: "out_of_stock" as const },
      { name: "Yoga Mat Premium",          sku: "YMP-1010", category: "Sports",      price: 3900,  stock: 7,   status: "low_stock"    as const },
      { name: "Stainless Water Bottle",    sku: "SWB-5500", category: "Lifestyle",   price: 2499,  stock: 120, status: "in_stock"     as const },
      { name: "Mechanical Keyboard TKL",   sku: "MKT-8800", category: "Electronics", price: 18900, stock: 3,   status: "low_stock"    as const },
      { name: "Running Shoes Ultra",       sku: "RSU-3300", category: "Sports",      price: 9500,  stock: 55,  status: "in_stock"     as const },
      { name: "Scented Candle Set",        sku: "SCS-0707", category: "Lifestyle",   price: 3200,  stock: 0,   status: "out_of_stock" as const },
    ];
    for (const item of seed) await ctx.db.insert("items", item);
  },
});
