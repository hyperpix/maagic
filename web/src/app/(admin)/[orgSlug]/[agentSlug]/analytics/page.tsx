"use client";

import { useWorkspace } from "@/contexts/WorkspaceContext";
import { AnalyticsPage } from "@/components/analytics-page";

export default function AnalyticsRoute() {
  const { activeAgent } = useWorkspace();
  return <AnalyticsPage agentId={activeAgent._id} />;
}
