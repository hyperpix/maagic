"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-80 h-96 shadow-xl flex flex-col overflow-hidden border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium">Chat with us</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="text-center text-muted-foreground text-xs mt-4">
                No messages yet. Say hello!
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-3 border-t bg-background">
             {/* Input will be added in next task */}
             <div className="text-xs text-muted-foreground text-center">
               Input coming soon...
             </div>
          </div>
        </Card>
      )}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg shrink-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
};
