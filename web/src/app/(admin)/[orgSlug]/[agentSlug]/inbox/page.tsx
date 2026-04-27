"use client";

import { useWorkspace } from "@/contexts/WorkspaceContext";
import { InboxView } from "@/components/inbox-view";

export default function InboxPage() {
  const { activeAgent } = useWorkspace();
  return <InboxView agentId={activeAgent._id} />;
}
