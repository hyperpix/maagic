import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense>
        <AuthForm flow="signIn" />
      </Suspense>
    </div>
  );
}
