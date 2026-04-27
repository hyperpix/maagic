import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Maagic</h1>
        <p className="text-muted-foreground">Live chat powered by AI</p>
      </div>
      <div className="flex gap-3">
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Create account</Button>
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">
        To embed a widget on your site, use{" "}
        <code className="font-mono">/widget/[widgetKey]</code>
      </p>
    </div>
  );
}
