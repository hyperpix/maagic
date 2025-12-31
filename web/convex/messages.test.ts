import { test, expect, vi } from "vitest";
import { sendMessageInternal } from "./messages";

test("sendMessage inserts a new message", async () => {
  const mockInsert = vi.fn().mockResolvedValue("message_id_123");
  const ctx = {
    db: {
      insert: mockInsert,
    },
  };
  
  const result = await sendMessageInternal(ctx, {
    conversationId: "conv_123" as any,
    sender: "visitor",
    content: "Hello",
  });
  
  expect(result).toBe("message_id_123");
  expect(mockInsert).toHaveBeenCalledWith("messages", {
    conversationId: "conv_123",
    sender: "visitor",
    content: "Hello",
    createdAt: expect.any(Number),
  });
});
