import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getConversationsInternal = async (ctx: any) => {
  return await ctx.db.query("conversations").order("desc").collect();
};

export const getConversations = query({
  args: {},
  handler: getConversationsInternal,
});

export const createConversationInternal = async (ctx: any, args: { visitorId: string }) => {
  const conversationId = await ctx.db.insert("conversations", {
    visitorId: args.visitorId,
    createdAt: Date.now(),
  });
  return conversationId;
};

export const createConversation = mutation({
  args: { visitorId: v.string() },
  handler: createConversationInternal,
});
