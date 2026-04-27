import { redirect } from "next/navigation";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const token = await convexAuthNextjsToken();
  if (!token) redirect("/login");

  const [org, orgs] = await Promise.all([
    fetchQuery(api.organizations.getOrgBySlug, { slug: orgSlug }, { token }),
    fetchQuery(api.organizations.getMyOrgs, {}, { token }),
  ]);

  if (!org) redirect("/");

  const isMember = orgs?.some((o: any) => o?._id === org._id);
  if (!isMember) redirect("/");

  return <>{children}</>;
}
