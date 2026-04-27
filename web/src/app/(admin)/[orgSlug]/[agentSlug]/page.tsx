import { redirect } from "next/navigation";

export default async function AgentIndexPage({
  params,
}: {
  params: Promise<{ orgSlug: string; agentSlug: string }>;
}) {
  const { orgSlug, agentSlug } = await params;
  redirect(`/${orgSlug}/${agentSlug}/inbox`);
}
