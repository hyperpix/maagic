"use client";

import { useWorkspace } from "@/contexts/WorkspaceContext";
import { KnowledgeView } from "@/components/knowledge-view";

export default function KnowledgePage() {
  const { activeAgent } = useWorkspace();
  return <KnowledgeView agentId={activeAgent._id} />;
}
