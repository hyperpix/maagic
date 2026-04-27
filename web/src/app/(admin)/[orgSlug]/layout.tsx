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

  const org = await fetchQuery(api.organizations.getOrgBySlug, { slug: orgSlug }, { token });
  if (!org) redirect("/");

  return <>{children}</>;
}
