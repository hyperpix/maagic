import { test, expect, vi } from "vitest";
import { createConversationInternal, getConversationsInternal } from "./conversations";

test("getConversations returns all conversations ordered by desc", async () => {
  const mockConversations = [{ visitorId: "v1" }, { visitorId: "v2" }];
  const mockQuery = {
    order: vi.fn().mockReturnThis(),
    collect: vi.fn().mockResolvedValue(mockConversations),
  };
  const ctx = {
    db: {
      query: vi.fn().mockReturnValue(mockQuery),
    },
  };
  
  const result = await getConversationsInternal(ctx);
  
  expect(result).toEqual(mockConversations);
  expect(ctx.db.query).toHaveBeenCalledWith("conversations");
  expect(mockQuery.order).toHaveBeenCalledWith("desc");
});

test("createConversation inserts a new conversation", async () => {
  const mockInsert = vi.fn().mockResolvedValue("conversation_id_123");
  const ctx = {
    db: {
      insert: mockInsert,
    },
  };
  
  const result = await createConversationInternal(ctx, { visitorId: "visitor_123" });
  
  expect(result).toBe("conversation_id_123");
  expect(mockInsert).toHaveBeenCalledWith("conversations", {
    visitorId: "visitor_123",
    createdAt: expect.any(Number),
  });
});
