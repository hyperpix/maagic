import { redirect } from "next/navigation";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export default async function AdminIndexPage() {
  const token = await convexAuthNextjsToken();
  if (!token) redirect("/login");

  const orgs = await fetchQuery(api.organizations.getMyOrgs, {}, { token });

  if (!orgs || orgs.length === 0) {
    redirect("/onboarding/create-org");
  }

  redirect(`/${orgs[0]!.slug}`);
}
