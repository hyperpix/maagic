"use client";

import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EmbedPage() {
  const { activeAgent } = useWorkspace();
  const rotateKey = useMutation(api.agents.rotateWidgetKey);
  const [rotating, setRotating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const scriptTag = `<script\n  src="${typeof window !== "undefined" ? window.location.origin : ""}/widget.js"\n  data-widget-key="${activeAgent.widgetKey}"\n  async\n></script>`;

  const iframeTag = `<iframe\n  src="${typeof window !== "undefined" ? window.location.origin : ""}/widget/${activeAgent.widgetKey}"\n  style="border:none;position:fixed;bottom:24px;right:24px;width:400px;height:500px;z-index:9999"\n></iframe>`;

  const previewUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/widget/${activeAgent.widgetKey}`
      : `/widget/${activeAgent.widgetKey}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleRotate = async () => {
    setRotating(true);
    setDialogOpen(false);
    try {
      await rotateKey({ agentId: activeAgent._id });
      toast.success("Widget key rotated. Update your embeds.");
    } catch {
      toast.error("Failed to rotate key");
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Embed your widget</h1>
        <p className="text-muted-foreground mt-1">Add the chat widget to any website.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Script tag (recommended)</CardTitle>
          <CardDescription>Paste before the closing &lt;/body&gt; tag.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {scriptTag}
          </pre>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleCopy(scriptTag)}>Copy</Button>
            <Button variant="outline" size="sm" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">Preview widget ↗</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">iframe embed</CardTitle>
          <CardDescription>Alternative method using an iframe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {iframeTag}
          </pre>
          <Button variant="outline" size="sm" onClick={() => handleCopy(iframeTag)}>Copy</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Widget key</CardTitle>
          <CardDescription>
            This key identifies your agent. Rotate it if you believe it has been compromised — this will invalidate all existing embeds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{activeAgent.widgetKey}</code>
          <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={rotating}>
                  {rotating ? "Rotating..." : "Rotate key"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rotate widget key?</DialogTitle>
                  <DialogDescription>
                    This will immediately invalidate your current embed snippet. Any website using the old key will stop showing the widget until you update the snippet.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleRotate} disabled={rotating}>
                    Rotate key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
