"use client"

import { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function HomePage({ agentId }: { agentId?: Id<"agents"> }) {
  const conversations = useQuery(
    api.conversations.getConversations,
    agentId ? { agentId } : "skip"
  )
  const allMessages = useQuery(
    api.messages.getAllMessages,
    agentId ? { agentId } : "skip"
  )

  const data = useMemo(() => {
    const totalConversations = conversations?.length || 0
    const unopenedConversations = conversations?.filter((conv: any) => !conv.openedAt).length || 0
    const totalMessages = allMessages?.length || 0
    const activeToday = conversations?.filter((conv: any) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return new Date(conv.createdAt) >= today
    }).length || 0

    // Calculate changes (simplified - comparing to previous period)
    const calculateChange = (current: number) => {
      // In a real app, you'd compare to previous period
      // For now, showing a positive change if there's data
      if (current > 0) return "+12.5%"
      return "0%"
    }

    return [
      {
        name: "Conversations",
        value: totalConversations.toLocaleString(),
        change: calculateChange(totalConversations),
        changeType: "positive" as const,
        href: "#",
      },
      {
        name: "Unopened",
        value: unopenedConversations.toLocaleString(),
        change: calculateChange(unopenedConversations),
        changeType: unopenedConversations > 0 ? "negative" as const : "positive" as const,
        href: "#",
      },
      {
        name: "Active Today",
        value: activeToday.toLocaleString(),
        change: calculateChange(activeToday),
        changeType: "positive" as const,
        href: "#",
      },
      {
        name: "Messages",
        value: totalMessages.toLocaleString(),
        change: calculateChange(totalMessages),
        changeType: "positive" as const,
        href: "#",
      },
    ]
  }, [conversations, allMessages])

  return (
    <div className="flex-1 overflow-auto p-6 flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="space-y-1 text-center mb-8">
          <h1 className="text-2xl font-semibold">
            Hello Sokhina <span className="inline-block">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your conversations today
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {data.map((item, index) => {
              const softColors = [
                "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30",
                "bg-purple-50/50 dark:bg-purple-950/20 border-purple-100/50 dark:border-purple-900/30",
                "bg-pink-50/50 dark:bg-pink-950/20 border-pink-100/50 dark:border-pink-900/30",
                "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30",
              ]
              return (
              <Card key={item.name} className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[index % softColors.length])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">
                      {item.name}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        item.changeType === "positive"
                          ? "text-emerald-700 dark:text-emerald-500"
                          : "text-red-700 dark:text-red-500"
                      )}
                    >
                      {item.change}
                    </span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">
                    {item.value}
                  </dd>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-border p-0 bg-white dark:bg-gray-950 rounded-b-lg">
                  <a
                    href={item.href}
                    className="px-6 py-3 text-sm font-medium text-primary hover:text-primary/90"
                  >
                    View more &#8594;
                  </a>
                </CardFooter>
              </Card>
            )})}
        </dl>
      </div>
    </div>
  )
}

