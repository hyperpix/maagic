"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function CreateOrgPage() {
  const router = useRouter();
  const createOrg = useMutation(api.organizations.createOrg);
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
    setError(null);
    setLoading(true);
    try {
      await createOrg({ name, slug });
      router.push(`/onboarding/create-agent?orgSlug=${slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your organization</CardTitle>
          <CardDescription>This is your workspace in Maagic.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input
                id="org-name"
                placeholder="Acme Inc"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="org-slug">URL slug</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground shrink-0">maagic.com/</span>
                <Input
                  id="org-slug"
                  placeholder="acme-inc"
                  value={slug}
                  onChange={(e) => { setSlug(toSlug(e.target.value)); setSlugEdited(true); }}
                  required
                  pattern="[a-z0-9-]+"
                  title="Lowercase letters, numbers, and hyphens only"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading || !name || !slug}>
              {loading ? "Creating..." : "Create organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
