"use client";

import { useEffect, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const acceptInvitation = useMutation(api.members.acceptInvitation);
  const [status, setStatus] = useState<"idle" | "accepting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (status !== "idle") return;
    setStatus("accepting");
    acceptInvitation({ token })
      .then((orgSlug) => {
        setStatus("done");
        router.push(`/${orgSlug}`);
      })
      .catch((err: unknown) => {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Invalid or expired invitation.");
      });
  }, [isAuthenticated, status, token, acceptInvitation, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>You have been invited</CardTitle>
            <CardDescription>Sign in or create an account to accept this invitation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href={`/login?next=/invite/${token}`}>
              <Button className="w-full">Sign in</Button>
            </Link>
            <Link href={`/signup?next=/invite/${token}`}>
              <Button variant="outline" className="w-full">Create account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>
            {status === "accepting" && "Accepting invitation..."}
            {status === "done" && "Redirecting..."}
            {status === "error" && "Invitation error"}
          </CardTitle>
          {status === "error" && (
            <CardDescription className="text-destructive">{errorMsg}</CardDescription>
          )}
        </CardHeader>
        {status === "error" && (
          <CardContent>
            <Link href="/"><Button variant="outline" className="w-full">Go to home</Button></Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
