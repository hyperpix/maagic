import { test, expect, vi } from "vitest";
import { createConversationInternal } from "./conversations";

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
