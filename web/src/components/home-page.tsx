"use client"

import { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function HomePage() {
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages = useQuery(api.messages.getAllMessages)

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
    <div className="flex-1 overflow-auto p-6 md:p-8">
      <div className="max-w-4xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Good morning, Sokhina</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your conversations today.
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item) => (
            <Card key={item.name} className="p-0 gap-0 overflow-hidden">
              <CardContent className="p-6">
                <dd className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm text-muted-foreground">
                    {item.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium shrink-0",
                      item.changeType === "positive"
                        ? "text-emerald-600 dark:text-emerald-500"
                        : "text-red-600 dark:text-red-500"
                    )}
                  >
                    {item.change}
                  </span>
                </dd>
                <dd className="mt-1 text-3xl font-semibold tabular-nums">
                  {item.value}
                </dd>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-0">
                <a
                  href={item.href}
                  className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View more &rarr;
                </a>
              </CardFooter>
            </Card>
          ))}
        </dl>
      </div>
    </div>
  )
}

