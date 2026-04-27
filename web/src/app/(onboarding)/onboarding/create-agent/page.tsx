"use client";

import { useState, Suspense } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function CreateAgentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgSlug = searchParams.get("orgSlug") ?? "";

  const org = useQuery(api.organizations.getOrgBySlug, orgSlug ? { slug: orgSlug } : "skip");
  const createAgent = useMutation(api.agents.createAgent);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(toSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setError(null);
    setLoading(true);
    try {
      await createAgent({ orgId: org._id, name, slug });
      router.push(`/onboarding/embed?orgSlug=${orgSlug}&agentSlug=${slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  if (!org && orgSlug) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your first agent</CardTitle>
        <CardDescription>Your agent handles visitor chat on your website.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-name">Agent name</Label>
            <Input
              id="agent-name"
              placeholder="Support Bot"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-slug">Slug</Label>
            <Input
              id="agent-slug"
              placeholder="support-bot"
              value={slug}
              onChange={(e) => { setSlug(toSlug(e.target.value)); setSlugEdited(true); }}
              required
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading || !name || !slug || !org}>
            {loading ? "Creating..." : "Create agent"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CreateAgentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense>
        <CreateAgentForm />
      </Suspense>
    </div>
  );
}
