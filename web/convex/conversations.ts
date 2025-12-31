import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
