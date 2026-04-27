"use client";

import { Suspense } from "react";
import { useQuery } from "convex/react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

function EmbedSetup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orgSlug = searchParams.get("orgSlug") ?? "";
  const agentSlug = searchParams.get("agentSlug") ?? "";

  const org = useQuery(api.organizations.getOrgBySlug, orgSlug ? { slug: orgSlug } : "skip");
  const agents = useQuery(api.agents.getAgents, org ? { orgId: org._id } : "skip");
  const agent = agents?.find((a: any) => a.slug === agentSlug);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const snippet = agent
    ? `<script\n  src="${origin}/widget.js"\n  data-widget-key="${agent.widgetKey}"\n  async\n></script>`
    : "Loading...";

  const handleCopy = () => {
    if (agent) {
      navigator.clipboard.writeText(snippet);
      toast.success("Copied to clipboard");
    }
  };

  const handleFinish = () => {
    router.push(`/${orgSlug}/${agentSlug}/inbox`);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Add the widget to your site</CardTitle>
        <CardDescription>Paste this snippet before the closing &lt;/body&gt; tag on your website.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="bg-muted rounded-md p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
          {snippet}
        </pre>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopy} className="flex-1">
            Copy snippet
          </Button>
          <Button onClick={handleFinish} className="flex-1">
            Go to inbox
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          You can find this snippet anytime in{" "}
          <Link href={`/${orgSlug}/${agentSlug}/embed`} className="underline">
            Agent &rarr; Embed
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function OnboardingEmbedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense>
        <EmbedSetup />
      </Suspense>
    </div>
  );
}
