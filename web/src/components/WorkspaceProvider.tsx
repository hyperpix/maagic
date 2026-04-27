"use client";

import { WorkspaceContext, Org, Agent } from "@/contexts/WorkspaceContext";

export function WorkspaceProvider({
  children,
  org,
  agent,
}: {
  children: React.ReactNode;
  org: Org;
  agent: Agent;
}) {
  return (
    <WorkspaceContext.Provider value={{ activeOrg: org, activeAgent: agent }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
