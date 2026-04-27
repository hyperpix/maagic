import { redirect } from "next/navigation";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { WorkspaceProvider } from "@/components/WorkspaceProvider";
import { AdminSidebarShell } from "@/components/AdminSidebarShell";

export default async function AgentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string; agentSlug: string }>;
}) {
  const { orgSlug, agentSlug } = await params;
  const token = await convexAuthNextjsToken();
  if (!token) redirect("/login");

  const org = await fetchQuery(api.organizations.getOrgBySlug, { slug: orgSlug }, { token });
  if (!org) redirect("/");

  const orgs = await fetchQuery(api.organizations.getMyOrgs, {}, { token });
  const agent = await fetchQuery(api.agents.getAgentBySlug, { orgId: org._id, slug: agentSlug }, { token });
  if (!agent) redirect(`/${orgSlug}`);

  const agents = await fetchQuery(api.agents.getAgents, { orgId: org._id }, { token });

  const orgWithRole = orgs?.find((o: any) => o?._id === org._id) as (typeof org & { role: string }) | undefined;

  return (
    <WorkspaceProvider
      org={{ ...org, role: (orgWithRole?.role ?? "member") as any }}
      agent={agent}
    >
      <AdminSidebarShell orgs={orgs as any} agents={agents} orgSlug={orgSlug} agentSlug={agentSlug}>
        {children}
      </AdminSidebarShell>
    </WorkspaceProvider>
  );
}
