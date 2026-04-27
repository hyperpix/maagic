"use client";

import { createContext, useContext } from "react";
import { Id } from "../../convex/_generated/dataModel";

export type OrgRole = "owner" | "admin" | "member";

export interface Org {
  _id: Id<"organizations">;
  name: string;
  slug: string;
  logoUrl?: string;
  role: OrgRole;
}

export interface Agent {
  _id: Id<"agents">;
  orgId: Id<"organizations">;
  name: string;
  slug: string;
  widgetKey: string;
  title?: string;
  description?: string;
  primaryColor?: string;
  backgroundColor?: string;
  greetingMessage?: string;
  baseInstructions?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface WorkspaceContextValue {
  activeOrg: Org;
  activeAgent: Agent;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a workspace layout");
  return ctx;
}
