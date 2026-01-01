import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMessagesInternal = async (ctx: any, args: { conversationId: any }) => {
  return await ctx.db
    .query("messages")
    .withIndex("by_conversation", (q: any) => q.eq("conversationId", args.conversationId))
    .collect();
};

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: getMessagesInternal,
});

export const getAllMessages = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

export const sendMessageInternal = async (
  ctx: any,
  args: { conversationId: any; sender: "visitor" | "agent"; content: string }
) => {
  const messageId = await ctx.db.insert("messages", {
    conversationId: args.conversationId,
    sender: args.sender,
    content: args.content,
    createdAt: Date.now(),
  });
  return messageId;
};

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    sender: v.union(v.literal("visitor"), v.literal("agent")),
    content: v.string(),
  },
  handler: sendMessageInternal,
});
