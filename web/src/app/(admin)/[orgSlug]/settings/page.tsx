"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrgSettingsPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const org = useQuery(api.organizations.getOrgBySlug, { slug: orgSlug });
  const updateOrg = useMutation(api.organizations.updateOrg);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (org) setName(org.name);
  }, [org]);

  const handleSave = async () => {
    if (!org) return;
    setSaving(true);
    try {
      await updateOrg({ orgId: org._id, name });
      toast.success("Organization updated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (!org) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization settings</h1>
        <p className="text-muted-foreground mt-1">/{org.slug}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Update your organization name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Name</Label>
            <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
