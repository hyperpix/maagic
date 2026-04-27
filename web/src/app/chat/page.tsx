import Link from "next/link";
import { Button } from "@/components/ui/button";

// Demo page — redirects users to login or shows embed instructions
export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4 text-center p-4">
      <h2 className="text-xl font-semibold">Chat widget demo</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        To use the chat widget, embed it on your site using your agent&apos;s widget key from the admin panel.
      </p>
      <Link href="/login">
        <Button>Go to admin</Button>
      </Link>
    </div>
  );
}
