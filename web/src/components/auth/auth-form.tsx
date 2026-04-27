"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type AuthFlow = "signIn" | "signUp" | "reset";

interface AuthFormProps {
  flow: AuthFlow;
}

export function AuthForm({ flow }: AuthFormProps) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (flow === "reset") {
        await signIn("password", { email, flow: "reset" });
        setResetSent(true);
      } else {
        await signIn("password", { email, password, flow });
        router.push(next);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<AuthFlow, string> = {
    signIn: "Sign in to Maagic",
    signUp: "Create your account",
    reset: "Reset your password",
  };

  const descriptions: Record<AuthFlow, string> = {
    signIn: "Enter your email and password to continue.",
    signUp: "Fill in the details below to get started.",
    reset: "Enter your email and we'll send a reset link.",
  };

  if (resetSent) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Check your email</CardTitle>
          <CardDescription>We sent a password reset link to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="outline" className="w-full">Back to sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{titles[flow]}</CardTitle>
        <CardDescription>{descriptions[flow]}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          {flow !== "reset" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {flow === "signIn" && (
                  <Link href="/forgot" className="text-xs text-muted-foreground hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={flow === "signIn" ? "current-password" : "new-password"}
              />
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : flow === "signIn"
              ? "Sign in"
              : flow === "signUp"
              ? "Create account"
              : "Send reset link"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {flow === "signIn" ? (
              <>Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-foreground hover:underline">Sign up</Link>
              </>
            ) : flow === "signUp" ? (
              <>Already have an account?{" "}
                <Link href="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
              </>
            ) : (
              <Link href="/login" className="font-medium text-foreground hover:underline">Back to sign in</Link>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
