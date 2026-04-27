import { describe, test, expect } from "vitest";
import { hasPermission } from "./permissions";
import type { Permission, Role } from "./permissions";

const ALL_PERMISSIONS: Permission[] = [
  "org:read", "org:update", "org:delete",
  "member:read", "member:invite", "member:update_role", "member:remove",
  "agent:create", "agent:read", "agent:update", "agent:delete",
  "knowledge:read", "knowledge:write", "knowledge:delete",
  "conversation:read", "conversation:reply", "conversation:delete",
  "analytics:read",
];

describe("hasPermission — owner", () => {
  test("has all permissions", () => {
    for (const perm of ALL_PERMISSIONS) {
      expect(hasPermission("owner", perm), `owner missing ${perm}`).toBe(true);
    }
  });
});

describe("hasPermission — admin", () => {
  test("has all permissions except org:delete", () => {
    for (const perm of ALL_PERMISSIONS) {
      if (perm === "org:delete") {
        expect(hasPermission("admin", perm), "admin must not have org:delete").toBe(false);
      } else {
        expect(hasPermission("admin", perm), `admin missing ${perm}`).toBe(true);
      }
    }
  });
});

describe("hasPermission — member", () => {
  const MEMBER_ALLOWED: Permission[] = [
    "org:read",
    "member:read",
    "agent:read",
    "knowledge:read",
    "knowledge:write",
    "conversation:read",
    "conversation:reply",
    "analytics:read",
  ];

  const MEMBER_DENIED: Permission[] = ALL_PERMISSIONS.filter(
    (p) => !MEMBER_ALLOWED.includes(p)
  );

  test("has expected permissions", () => {
    for (const perm of MEMBER_ALLOWED) {
      expect(hasPermission("member", perm), `member missing ${perm}`).toBe(true);
    }
  });

  test("denied privileged permissions", () => {
    for (const perm of MEMBER_DENIED) {
      expect(hasPermission("member", perm), `member must not have ${perm}`).toBe(false);
    }
  });

  test("cannot delete org", () => {
    expect(hasPermission("member", "org:delete")).toBe(false);
  });

  test("cannot invite members", () => {
    expect(hasPermission("member", "member:invite")).toBe(false);
  });

  test("cannot delete knowledge", () => {
    expect(hasPermission("member", "knowledge:delete")).toBe(false);
  });

  test("cannot delete conversations", () => {
    expect(hasPermission("member", "conversation:delete")).toBe(false);
  });

  test("cannot create agents", () => {
    expect(hasPermission("member", "agent:create")).toBe(false);
  });

  test("cannot delete agents", () => {
    expect(hasPermission("member", "agent:delete")).toBe(false);
  });
});

describe("role escalation guards", () => {
  test("member cannot update member roles", () => {
    expect(hasPermission("member", "member:update_role")).toBe(false);
  });

  test("member cannot remove other members", () => {
    expect(hasPermission("member", "member:remove")).toBe(false);
  });

  test("admin can update member roles", () => {
    expect(hasPermission("admin", "member:update_role")).toBe(true);
  });

  test("admin can invite members", () => {
    expect(hasPermission("admin", "member:invite")).toBe(true);
  });

  test("only owner can delete org", () => {
    const roles: Role[] = ["owner", "admin", "member"];
    const results = roles.map((r) => hasPermission(r, "org:delete"));
    expect(results).toEqual([true, false, false]);
  });
});
