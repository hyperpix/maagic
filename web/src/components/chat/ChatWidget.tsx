"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<any>(null);

  const createConversation = useMutation(api.conversations.createConversation);
  const sendMessage = useMutation(api.messages.sendMessage);
  
  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversationId } : "skip"
  );

  useEffect(() => {
    let id = localStorage.getItem("chat_visitor_id");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_visitor_id", id);
    }
    setVisitorId(id);
    
    const convId = localStorage.getItem("chat_conversation_id");
    if (convId) {
      setConversationId(convId);
    }
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !visitorId) return;

    let currentConvId = conversationId;
    if (!currentConvId) {
      currentConvId = await createConversation({ visitorId });
      setConversationId(currentConvId);
      localStorage.setItem("chat_conversation_id", currentConvId as string);
    }

    await sendMessage({
      conversationId: currentConvId,
      sender: "visitor",
      content: message.trim(),
    });

    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-80 h-96 shadow-xl flex flex-col overflow-hidden border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="py-3 px-4 border-b">
            <CardTitle className="text-sm font-medium">Chat with us</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="flex flex-col gap-3">
                {messages === undefined ? (
                  <div className="text-center text-muted-foreground text-xs mt-4">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-xs mt-4">
                    No messages yet. Say hello!
                  </div>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg._id}
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        msg.sender === "visitor"
                          ? "bg-primary text-primary-foreground self-end"
                          : "bg-muted self-start"
                      )}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <form onSubmit={handleSend} className="p-3 border-t bg-background flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-sm h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
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
