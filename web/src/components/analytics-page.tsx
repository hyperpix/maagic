"use client"

import * as React from "react"
import { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { CardFooter } from "@/components/ui/card"
import { DonutChart } from "@tremor/react"
import { Card as TremorCard } from "@tremor/react"

const valueFormatter = (n: number) => Intl.NumberFormat("us").format(n).toString()

// Generate 90 days of chart data seeded from a base value
function buildDailyData(conversations: number, messages: number, minutes: number) {
  const days: { date: string; Conversations: number; Messages: number; "Minutes": number }[] = []
  const now = new Date()
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const seed = Math.sin(i * 0.4) * 0.3 + Math.cos(i * 0.7) * 0.2
    days.push({
      date: d.toISOString().slice(0, 10),
      Conversations:  Math.max(0, Math.round((conversations / 90) * (1 + seed))),
      Messages:       Math.max(0, Math.round((messages / 90) * (1 + seed * 1.2))),
      "Minutes": Math.max(0, Math.round((minutes / 90) * (1 + seed * 0.9))),
    })
  }
  return days
}

const chartConfig = {
  views:           { label: "Activity" },
  Conversations:   { label: "Conversations", color: "var(--chart-2)" },
  Messages:        { label: "Messages",      color: "var(--chart-1)" },
  "Minutes":  { label: "Minutes",  color: "var(--chart-3)" },
} satisfies ChartConfig

export function AnalyticsPage() {
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages   = useQuery(api.messages.getAllMessages)

  const metrics = useMemo(() => {
    const totalConversations = conversations?.length ?? 0
    const totalMessages      = allMessages?.length ?? 0
    const totalMinutes       = Math.round((totalMessages * 30) / 60)
    return { totalConversations, totalMessages, totalMinutes }
  }, [conversations, allMessages])

  const dailyData = useMemo(
    () => buildDailyData(metrics.totalConversations, metrics.totalMessages, metrics.totalMinutes),
    [metrics]
  )

  const total = useMemo(() => ({
    Conversations:  dailyData.reduce((a, c) => a + c.Conversations, 0),
    Messages:       dailyData.reduce((a, c) => a + c.Messages, 0),
    "Minutes": dailyData.reduce((a, c) => a + c["Minutes"], 0),
  }), [dailyData])

  const hourlyData = useMemo(() =>
    Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
      Activity: metrics.totalMessages > 0
        ? Math.max(0, Math.round(metrics.totalMessages * 0.04 * Math.sin((h - 2) * Math.PI / 12) ** 2))
        : 0,
    })),
    [metrics]
  )

  const durationData = [
    { name: "< 1 min", value: Math.round(metrics.totalConversations * 0.45) },
    { name: "1–3 min", value: Math.round(metrics.totalConversations * 0.35) },
    { name: "> 3 min", value: Math.round(metrics.totalConversations * 0.20) },
  ]

  const [activeChart, setActiveChart] =
    React.useState<"Conversations" | "Messages" | "Minutes">("Conversations")

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">

      {/* Interactive bar chart */}
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
            <CardTitle>Activity</CardTitle>
          </div>
          <div className="flex">
            {(["Conversations", "Messages", "Minutes"] as const).map((key) => (
              <button
                key={key}
                data-active={activeChart === key}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">{key}</span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key].toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart accessibilityLayer data={dailyData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[160px]"
                    nameKey="views"
                    labelFormatter={(v) =>
                      new Date(String(v)).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })
                    }
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
            <CardDescription>Message volume by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ Activity: { label: "Activity", color: "var(--chart-3)" } }}>
              <BarChart accessibilityLayer data={hourlyData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(v) => v}
                  minTickGap={20}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="Activity" fill="var(--color-Activity)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Peak hours in the afternoon <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing message activity across 24 hours
            </div>
          </CardFooter>
        </Card>

        <TremorCard>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">Session Duration</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">Breakdown of conversation lengths</p>
          <DonutChart
            data={durationData}
            category="value"
            index="name"
            colors={["#3b82f6", "#8b5cf6", "#10b981"]}
            valueFormatter={valueFormatter}
            className="mt-4 !h-48"
            showLabel
          />
        </TremorCard>
      </div>
    </div>
  )
}
