"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function MembersPage() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const org = useQuery(api.organizations.getOrgBySlug, { slug: orgSlug });
  const members = useQuery(api.members.getMembers, org ? { orgId: org._id } : "skip");
  const pending = useQuery(api.members.getPendingInvitations, org ? { orgId: org._id } : "skip");
  const inviteMutation = useMutation(api.members.inviteMember);
  const updateRole = useMutation(api.members.updateMemberRole);
  const removeMember = useMutation(api.members.removeMember);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [inviting, setInviting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    setInviting(true);
    try {
      await inviteMutation({ orgId: org._id, email, role });
      toast.success(`Invitation sent to ${email}`);
      setEmail("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!org) return;
    try {
      await removeMember({ orgId: org._id, targetUserId: userId as any });
      toast.success("Member removed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  if (!org) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-muted-foreground mt-1">Manage who has access to {org.name}.</p>
      </div>

      {/* Current members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {members?.map((m: any) => {
            const name = m.name ?? m.email ?? "Unknown";
            const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={m._id} className="flex items-center gap-3 py-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={m.image ?? ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.email}</p>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{m.role}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateRole({ orgId: org._id, targetUserId: m.userId, role: "admin" })}>
                      Make admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRole({ orgId: org._id, targetUserId: m.userId, role: "member" })}>
                      Make member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleRemove(m.userId)}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Pending invitations */}
      {pending && pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending invitations</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {pending.map((inv: any) => (
              <div key={inv._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">{inv.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{inv.role}</p>
                </div>
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Invite form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite a member</CardTitle>
          <CardDescription>They will receive an email with a link to join.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "member")}
              className="border rounded-md px-2 text-sm bg-background"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" disabled={inviting}>
              {inviting ? "Sending..." : "Invite"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
