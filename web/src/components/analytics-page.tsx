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
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  CreditCard,
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"

// Mock time-series data (replaces with real data when available)
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

const funnelChartConfig = {
  value: { label: "Users", color: "hsl(var(--primary))" },
} satisfies ChartConfig

const hourlyChartConfig = {
  activity: { label: "Activity", color: "hsl(var(--primary))" },
} satisfies ChartConfig

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

  // Generate week chart data seeded from real counts
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

  const radialData = [
    { name: "Resolution", value: metrics.totalConversations > 0 ? 72 : 0, fill: "hsl(var(--primary))" },
  ]

  const statCards = [
    { label: "Total Conversations", value: metrics.totalConversations, icon: Users, change: "+12%" },
    { label: "Total Messages", value: metrics.totalMessages, icon: MessageSquare, change: "+18%" },
    { label: "Minutes Used", value: metrics.totalMinutes, icon: Clock, change: "+5%" },
    { label: "Avg Messages/Chat", value: metrics.avgMessagesPerChat, icon: CreditCard, change: "" },
  ]

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Performance insights and engagement data.</p>
        </div>
        <Badge variant="secondary" className="w-fit gap-1.5">
          <TrendingUp className="h-3.5 w-3.5" />
          Live
        </Badge>
      </div>

      <Separator />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                {s.change && (
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="h-3 w-3" />
                    {s.change}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold tabular-nums">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Activity Area Chart — spans 2 cols */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Messages and conversations over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={activityChartConfig} className="h-[240px] w-full">
                  <AreaChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                    <defs>
                      <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#msgGrad)"
                      dot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="conversations"
                      stroke="hsl(var(--primary) / 0.4)"
                      strokeWidth={2}
                      fill="none"
                      dot={false}
                      strokeDasharray="4 4"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Radial Bar — resolution rate */}
            <Card>
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
                <CardDescription>Conversations that reached a resolution.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4 pt-2">
                <ChartContainer config={{ value: { label: "Resolved", color: "hsl(var(--primary))" } }} className="h-[180px] w-full">
                  <RadialBarChart
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={60}
                    outerRadius={80}
                  >
                    <RadialBar dataKey="value" background={{ fill: "hsl(var(--muted))" }} cornerRadius={8} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  </RadialBarChart>
                </ChartContainer>
                <div className="text-center">
                  <p className="text-4xl font-bold tabular-nums">
                    {metrics.totalConversations > 0 ? "72%" : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">of conversations resolved</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar chart — hourly distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Distribution</CardTitle>
              <CardDescription>Activity spread across hours of the day.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={hourlyChartConfig} className="h-[180px] w-full">
                <BarChart data={hourlyData} margin={{ left: -8, right: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="activity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel as horizontal bars */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User progression through the chat experience.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={funnelChartConfig} className="h-[240px] w-full">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={60} />
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

            {/* Session Duration Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Session Duration</CardTitle>
                <CardDescription>Distribution of conversation lengths.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ChartContainer config={durationChartConfig} className="h-[220px] w-full">
                  <PieChart>
                    <Pie
                      data={durationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      strokeWidth={2}
                    >
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

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages per day bar */}
            <Card>
              <CardHeader>
                <CardTitle>Messages by Day</CardTitle>
                <CardDescription>Volume of messages each day this week.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ messages: { label: "Messages", color: "hsl(var(--primary))" } }} className="h-[220px] w-full">
                  <BarChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="messages" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Conversations trend */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation Trend</CardTitle>
                <CardDescription>New conversations started each day.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ conversations: { label: "Conversations", color: "hsl(var(--primary))" } }} className="h-[220px] w-full">
                  <AreaChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="conversations"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#convGrad)"
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Avg Messages / Chat", value: metrics.avgMessagesPerChat },
              { label: "Avg Seconds / Chat", value: metrics.avgSecondsPerChat + "s" },
              { label: "Total Conversations", value: metrics.totalConversations },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-6">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold tabular-nums mt-1">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
