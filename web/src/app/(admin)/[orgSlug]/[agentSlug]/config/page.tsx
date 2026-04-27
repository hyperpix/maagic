"use client";

import { useWorkspace } from "@/contexts/WorkspaceContext";
import { AgentPage } from "@/components/agent-page";

export default function AgentConfigPage() {
  const { activeAgent } = useWorkspace();
  return <AgentPage agentId={activeAgent._id} />;
}
