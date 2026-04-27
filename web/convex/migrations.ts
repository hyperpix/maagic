import { internalMutation } from "./_generated/server";

export const cleanSlate = internalMutation({
  args: {},
  handler: async (ctx) => {
    const [conversations, messages, knowledge] = await Promise.all([
      ctx.db.query("conversations").collect(),
      ctx.db.query("messages").collect(),
      ctx.db.query("knowledge").collect(),
    ]);

    await Promise.all([
      ...conversations.map((doc) => ctx.db.delete(doc._id)),
      ...messages.map((doc) => ctx.db.delete(doc._id)),
      ...knowledge.map((doc) => ctx.db.delete(doc._id)),
    ]);

    return {
      deleted: {
        conversations: conversations.length,
        messages: messages.length,
        knowledge: knowledge.length,
      },
    };
  },
});
