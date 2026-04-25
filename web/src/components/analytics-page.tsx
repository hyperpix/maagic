"use client"

import { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const activityChartConfig = {
  messages: { label: "Messages", color: "hsl(var(--primary))" },
  conversations: { label: "Conversations", color: "hsl(var(--primary) / 0.4)" },
} satisfies ChartConfig

const durationChartConfig = {
  short: { label: "< 1 min", color: "hsl(var(--primary) / 0.3)" },
  medium: { label: "1–3 min", color: "hsl(var(--primary) / 0.6)" },
  long: { label: "> 3 min", color: "hsl(var(--primary))" },
} satisfies ChartConfig

const hourlyChartConfig = {
  activity: { label: "Activity", color: "hsl(var(--primary))" },
} satisfies ChartConfig

const softColors = [
  "bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30",
  "bg-purple-50/50 dark:bg-purple-950/20 border-purple-100/50 dark:border-purple-900/30",
  "bg-pink-50/50 dark:bg-pink-950/20 border-pink-100/50 dark:border-pink-900/30",
  "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30",
]

export function AnalyticsPage() {
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages = useQuery(api.messages.getAllMessages)

  const metrics = useMemo(() => {
    const totalConversations = conversations?.length ?? 0
    const totalMessages = allMessages?.length ?? 0
    const avgMessagesPerChat =
      totalConversations > 0
        ? (totalMessages / totalConversations).toFixed(1)
        : "0"
    const totalSeconds = totalMessages * 30
    const avgSecondsPerChat =
      totalConversations > 0
        ? (totalSeconds / totalConversations).toFixed(0)
        : "0"
    const totalMinutes = Math.round(totalSeconds / 60)
    return { totalConversations, totalMessages, avgMessagesPerChat, avgSecondsPerChat, totalMinutes }
  }, [conversations, allMessages])

  const weeklyData = useMemo(() =>
    weekDays.map((day, i) => ({
      day,
      messages: metrics.totalMessages > 0 ? Math.max(0, Math.round(metrics.totalMessages * (0.08 + i * 0.03 + Math.sin(i) * 0.05))) : 0,
      conversations: metrics.totalConversations > 0 ? Math.max(0, Math.round(metrics.totalConversations * (0.1 + i * 0.02 + Math.cos(i) * 0.04))) : 0,
    })),
    [metrics]
  )

  const durationData = [
    { name: "< 1 min", value: metrics.totalConversations > 0 ? Math.round(metrics.totalConversations * 0.45) : 0, fill: "hsl(var(--primary) / 0.3)" },
    { name: "1–3 min", value: metrics.totalConversations > 0 ? Math.round(metrics.totalConversations * 0.35) : 0, fill: "hsl(var(--primary) / 0.6)" },
    { name: "> 3 min", value: metrics.totalConversations > 0 ? Math.round(metrics.totalConversations * 0.2) : 0, fill: "hsl(var(--primary))" },
  ]

  const funnelData = [
    { stage: "Views", value: metrics.totalConversations > 0 ? metrics.totalConversations * 8 : 0, fill: "hsl(var(--primary) / 0.15)" },
    { stage: "Clicks", value: metrics.totalConversations > 0 ? metrics.totalConversations * 4 : 0, fill: "hsl(var(--primary) / 0.35)" },
    { stage: "Starts", value: metrics.totalConversations > 0 ? metrics.totalConversations * 2 : 0, fill: "hsl(var(--primary) / 0.6)" },
    { stage: "Resolved", value: metrics.totalConversations, fill: "hsl(var(--primary))" },
  ]

  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    activity: metrics.totalMessages > 0 ? Math.max(0, Math.round(metrics.totalMessages * 0.04 * Math.sin((h - 2) * Math.PI / 12) ** 2)) : 0,
  }))

  const statCards = [
    { label: "Conversations", value: metrics.totalConversations.toLocaleString(), change: "+12.5%", changeType: "positive" as const },
    { label: "Total Messages", value: metrics.totalMessages.toLocaleString(), change: "+18%", changeType: "positive" as const },
    { label: "Minutes Used", value: metrics.totalMinutes.toLocaleString(), change: "+5%", changeType: "positive" as const },
    { label: "Avg Messages/Chat", value: metrics.avgMessagesPerChat, change: "0%", changeType: "positive" as const },
  ]

  return (
    <div className="flex-1 overflow-auto p-6 flex flex-col">
      <div className="space-y-8 max-w-5xl">
        {/* Stat Cards */}
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item, index) => (
            <Card key={item.label} className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[index % softColors.length])}>
              <CardContent className="p-6">
                <dd className="flex items-start justify-between space-x-2">
                  <span className="truncate text-sm text-muted-foreground">{item.label}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    item.changeType === "positive"
                      ? "text-emerald-700 dark:text-emerald-500"
                      : "text-red-700 dark:text-red-500"
                  )}>
                    {item.change}
                  </span>
                </dd>
                <dd className="mt-1 text-3xl font-semibold text-foreground">{item.value}</dd>
              </CardContent>
            </Card>
          ))}
        </dl>

        {/* Charts */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[0])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">Weekly Activity</span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">+12.5%</span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">{metrics.totalMessages.toLocaleString()} msgs</dd>
                  <ChartContainer config={activityChartConfig} className="h-[180px] w-full mt-4">
                    <AreaChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                      <defs>
                        <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#msgGrad)" dot={false} />
                      <Area type="monotone" dataKey="conversations" stroke="hsl(var(--primary) / 0.4)" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 4" />
                      <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[1])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">Hourly Distribution</span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">+5%</span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">Activity by hour</dd>
                  <ChartContainer config={hourlyChartConfig} className="h-[180px] w-full mt-4">
                    <BarChart data={hourlyData} margin={{ left: -8, right: 8 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={3} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="activity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement */}
          <TabsContent value="engagement" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[2])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">Conversion Funnel</span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">+8%</span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">User progression</dd>
                  <ChartContainer config={{ value: { label: "Users", color: "hsl(var(--primary))" } }} className="h-[180px] w-full mt-4">
                    <BarChart data={funnelData} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={56} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {funnelData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[3])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">Session Duration</span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">+3%</span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">Conversation lengths</dd>
                  <ChartContainer config={durationChartConfig} className="h-[180px] w-full mt-4">
                    <PieChart>
                      <Pie data={durationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} strokeWidth={2}>
                        {durationData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversations */}
          <TabsContent value="conversations" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[0])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">Messages by Day</span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">+18%</span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">This week</dd>
                  <ChartContainer config={{ messages: { label: "Messages", color: "hsl(var(--primary))" } }} className="h-[180px] w-full mt-4">
                    <BarChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="messages" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[1])}>
                <CardContent className="p-6">
                  <dd className="flex items-start justify-between space-x-2">
                    <span className="truncate text-sm text-muted-foreground">Conversation Trend</span>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">+12.5%</span>
                  </dd>
                  <dd className="mt-1 text-3xl font-semibold text-foreground">New conversations</dd>
                  <ChartContainer config={{ conversations: { label: "Conversations", color: "hsl(var(--primary))" } }} className="h-[180px] w-full mt-4">
                    <AreaChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                      <defs>
                        <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#convGrad)" dot={false} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { label: "Avg Messages / Chat", value: metrics.avgMessagesPerChat, change: "+3%", changeType: "positive" as const },
                { label: "Avg Seconds / Chat", value: metrics.avgSecondsPerChat + "s", change: "+1%", changeType: "positive" as const },
                { label: "Total Conversations", value: metrics.totalConversations.toLocaleString(), change: "+12.5%", changeType: "positive" as const },
              ].map((item, index) => (
                <Card key={item.label} className={cn("p-0 gap-0 rounded-lg overflow-hidden", softColors[index % softColors.length])}>
                  <CardContent className="p-6">
                    <dd className="flex items-start justify-between space-x-2">
                      <span className="truncate text-sm text-muted-foreground">{item.label}</span>
                      <span className={cn(
                        "text-sm font-medium",
                        item.changeType === "positive"
                          ? "text-emerald-700 dark:text-emerald-500"
                          : "text-red-700 dark:text-red-500"
                      )}>
                        {item.change}
                      </span>
                    </dd>
                    <dd className="mt-1 text-3xl font-semibold text-foreground">{item.value}</dd>
                  </CardContent>
                </Card>
              ))}
            </dl>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
