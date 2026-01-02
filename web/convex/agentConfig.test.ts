import { test, expect, vi } from "vitest";
import { getAgentConfigInternal, updateAgentConfigInternal } from "./agentConfig";

test("getAgentConfig returns the first config found", async () => {
  const mockConfig = {
    title: "My Agent",
    primaryColor: "#000000",
  };
  const mockQuery = {
    first: vi.fn().mockResolvedValue(mockConfig),
  };
  const ctx = {
    db: {
      query: vi.fn().mockReturnValue(mockQuery),
    },
  };

  const result = await getAgentConfigInternal(ctx);

  expect(result).toEqual(mockConfig);
  expect(ctx.db.query).toHaveBeenCalledWith("agentConfig");
  expect(mockQuery.first).toHaveBeenCalled();
});

test("updateAgentConfig updates existing config", async () => {
  const existingConfig = { _id: "config_123" };
  const mockQuery = {
    first: vi.fn().mockResolvedValue(existingConfig),
  };
  const mockPatch = vi.fn();
  const ctx = {
    db: {
      query: vi.fn().mockReturnValue(mockQuery),
      patch: mockPatch,
    },
  };

  await updateAgentConfigInternal(ctx, { title: "New Title" });

  expect(ctx.db.query).toHaveBeenCalledWith("agentConfig");
  expect(mockPatch).toHaveBeenCalledWith("config_123", { title: "New Title" });
});

test("updateAgentConfig creates new config if none exists", async () => {
  const mockQuery = {
    first: vi.fn().mockResolvedValue(null),
  };
  const mockInsert = vi.fn();
  const ctx = {
    db: {
      query: vi.fn().mockReturnValue(mockQuery),
      insert: mockInsert,
    },
  };

  await updateAgentConfigInternal(ctx, { title: "New Title" });

  expect(ctx.db.query).toHaveBeenCalledWith("agentConfig");
  expect(mockInsert).toHaveBeenCalledWith("agentConfig", { title: "New Title" });
});
