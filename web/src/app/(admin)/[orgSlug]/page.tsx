import { redirect } from "next/navigation";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export default async function OrgIndexPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const token = await convexAuthNextjsToken();
  if (!token) redirect("/login");

  const org = await fetchQuery(api.organizations.getOrgBySlug, { slug: orgSlug }, { token });
  if (!org) redirect("/");

  const agents = await fetchQuery(api.agents.getAgents, { orgId: org._id }, { token });

  if (!agents || agents.length === 0) {
    redirect(`/onboarding/create-agent?orgId=${org._id}&orgSlug=${orgSlug}`);
  }

  redirect(`/${orgSlug}/${agents[0]!.slug}/inbox`);
}
