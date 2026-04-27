import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAgentAccess } from "./lib/permissions";

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    return ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", conversationId))
      .collect();
  },
});

export const getAllMessages = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, { agentId }) => {
    await requireAgentAccess(ctx, agentId, "analytics:read");

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();

    const allMessages = await Promise.all(
      conversations.map((c) =>
        ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", c._id))
          .collect()
      )
    );

    return allMessages.flat();
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    sender: v.union(v.literal("visitor"), v.literal("agent")),
    content: v.string(),
  },
  handler: async (ctx, { conversationId, sender, content }) => {
    if (sender === "agent") {
      const conversation = await ctx.db.get(conversationId);
      if (!conversation?.agentId) throw new ConvexError("Conversation not found");
      await requireAgentAccess(ctx, conversation.agentId, "conversation:reply");
    }

    return ctx.db.insert("messages", {
      conversationId,
      sender,
      content,
      createdAt: Date.now(),
    });
  },
});
