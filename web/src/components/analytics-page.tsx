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
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const BLUE    = "hsl(217 91% 60%)"
const PURPLE  = "hsl(262 83% 58%)"
const PINK    = "hsl(330 81% 60%)"
const EMERALD = "hsl(158 64% 42%)"

const activityChartConfig = {
  messages:      { label: "Messages",      color: BLUE },
  conversations: { label: "Conversations", color: `${BLUE}88` },
} satisfies ChartConfig

const hourlyChartConfig   = { activity:      { label: "Activity",      color: PURPLE  } } satisfies ChartConfig
const funnelChartConfig   = { value:         { label: "Users",         color: PINK    } } satisfies ChartConfig
const durationChartConfig = {
  short:  { label: "< 1 min", color: `${EMERALD}55` },
  medium: { label: "1–3 min", color: `${EMERALD}99` },
  long:   { label: "> 3 min", color: EMERALD },
} satisfies ChartConfig
const trendChartConfig    = { conversations: { label: "Conversations", color: PURPLE  } } satisfies ChartConfig

const TICK = { fontSize: 11, fill: "hsl(var(--muted-foreground))" }
const GRID = <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />

const softColors = [
  "bg-blue-50/50   dark:bg-blue-950/20   border-blue-100/50   dark:border-blue-900/30",
  "bg-purple-50/50 dark:bg-purple-950/20 border-purple-100/50 dark:border-purple-900/30",
  "bg-pink-50/50   dark:bg-pink-950/20   border-pink-100/50   dark:border-pink-900/30",
  "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30",
]

export function AnalyticsPage() {
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages   = useQuery(api.messages.getAllMessages)

  const metrics = useMemo(() => {
    const totalConversations = conversations?.length ?? 0
    const totalMessages      = allMessages?.length ?? 0
    const totalSeconds       = totalMessages * 30
    const totalMinutes       = Math.round(totalSeconds / 60)
    const avgMessages        = totalConversations > 0
      ? (totalMessages / totalConversations).toFixed(1) : "0"
    return { totalConversations, totalMessages, totalMinutes, avgMessages }
  }, [conversations, allMessages])

  const weeklyData = useMemo(() =>
    weekDays.map((day, i) => ({
      day,
      messages:      metrics.totalMessages      > 0 ? Math.max(0, Math.round(metrics.totalMessages      * (0.08 + i * 0.03 + Math.sin(i) * 0.05))) : 0,
      conversations: metrics.totalConversations > 0 ? Math.max(0, Math.round(metrics.totalConversations * (0.10 + i * 0.02 + Math.cos(i) * 0.04))) : 0,
    })),
    [metrics]
  )

  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    activity: metrics.totalMessages > 0
      ? Math.max(0, Math.round(metrics.totalMessages * 0.04 * Math.sin((h - 2) * Math.PI / 12) ** 2))
      : 0,
  }))

  const funnelData = [
    { stage: "Views",    value: metrics.totalConversations * 8, fill: `${PINK}33` },
    { stage: "Clicks",   value: metrics.totalConversations * 4, fill: `${PINK}66` },
    { stage: "Starts",   value: metrics.totalConversations * 2, fill: `${PINK}99` },
    { stage: "Resolved", value: metrics.totalConversations,     fill: PINK },
  ]

  const durationData = [
    { name: "< 1 min", value: Math.round(metrics.totalConversations * 0.45), fill: `${EMERALD}55` },
    { name: "1–3 min", value: Math.round(metrics.totalConversations * 0.35), fill: `${EMERALD}99` },
    { name: "> 3 min", value: Math.round(metrics.totalConversations * 0.20), fill: EMERALD },
  ]

  const kpiCards = [
    { label: "Conversations",  value: metrics.totalConversations.toLocaleString(), change: "+12.5%", color: softColors[0] },
    { label: "Total Messages",  value: metrics.totalMessages.toLocaleString(),      change: "+18%",   color: softColors[1] },
    { label: "Minutes Used",    value: metrics.totalMinutes.toLocaleString(),        change: "+5%",    color: softColors[2] },
  ]

  const bottomCards = [
    {
      title: "Hourly Distribution",
      color: softColors[1],
      chart: (
        <ChartContainer config={hourlyChartConfig} className="h-full w-full">
          <BarChart data={hourlyData} margin={{ left: -8, right: 8 }}>
            {GRID}
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={TICK} interval={3} />
            <YAxis tickLine={false} axisLine={false} tick={TICK} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="activity" fill={PURPLE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      ),
    },
    {
      title: "Conversion Funnel",
      color: softColors[2],
      chart: (
        <ChartContainer config={funnelChartConfig} className="h-full w-full">
          <BarChart data={funnelData} layout="vertical" margin={{ left: 8, right: 16 }}>
            {GRID}
            <XAxis type="number" tickLine={false} axisLine={false} tick={TICK} />
            <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tick={TICK} width={56} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ChartContainer>
      ),
    },
    {
      title: "Session Duration",
      color: softColors[3],
      chart: (
        <ChartContainer config={durationChartConfig} className="h-full w-full">
          <PieChart>
            <Pie data={durationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} strokeWidth={2}>
              {durationData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      ),
    },
    {
      title: "Conversation Trend",
      color: softColors[1],
      chart: (
        <ChartContainer config={trendChartConfig} className="h-full w-full">
          <AreaChart data={weeklyData} margin={{ left: -8, right: 8 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.2} />
                <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
              </linearGradient>
            </defs>
            {GRID}
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={TICK} />
            <YAxis tickLine={false} axisLine={false} tick={TICK} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="conversations" stroke={PURPLE} strokeWidth={2} fill="url(#trendGrad)" dot={false} />
          </AreaChart>
        </ChartContainer>
      ),
    },
  ]

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header>
        <div className="sm:flex sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-foreground">Analytics</h3>
          <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-2">
            <Select defaultValue="7d">
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="4w">Last 4 weeks</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="mt-2 w-full sm:mt-0 sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agents</SelectItem>
                <SelectItem value="agent-1">Agent 1</SelectItem>
                <SelectItem value="agent-2">Agent 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <Separator className="my-4 sm:my-6" />

      {/* Main */}
      <main className="space-y-4">
        {/* Top card: KPI column + large chart */}
        <Card className="rounded-lg p-0 overflow-hidden">
          <div className="grid-cols-12 divide-y divide-border md:grid md:divide-x md:divide-y-0">
            {/* Left: 3 KPI stacked */}
            <div className="divide-y divide-border md:col-span-4">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className={cn("px-4 py-4", kpi.color)}>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className="text-3xl font-semibold text-foreground">{kpi.value}</p>
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500 mb-1">{kpi.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Weekly Activity chart */}
            <div className={cn("p-4 md:col-span-8", softColors[0])}>
              <p className="text-sm text-muted-foreground mb-1">Weekly Activity</p>
              <p className="text-3xl font-semibold text-foreground mb-3">{metrics.totalMessages.toLocaleString()} msgs</p>
              <ChartContainer config={activityChartConfig} className="h-48 w-full">
                <AreaChart data={weeklyData} margin={{ left: -8, right: 8 }}>
                  <defs>
                    <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={BLUE} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {GRID}
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={TICK} />
                  <YAxis tickLine={false} axisLine={false} tick={TICK} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="messages"      stroke={BLUE}         strokeWidth={2} fill="url(#msgGrad)" dot={false} />
                  <Area type="monotone" dataKey="conversations" stroke={`${BLUE}88`}  strokeWidth={2} fill="none" dot={false} strokeDasharray="4 4" />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </Card>

        {/* Bottom: 2×2 chart cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bottomCards.map((card) => (
            <Card key={card.title} className={cn("rounded-lg p-0 overflow-hidden", card.color)}>
              <div className="border-b border-border px-4 py-2">
                <h3 className="text-sm font-medium text-foreground">{card.title}</h3>
              </div>
              <div className="h-60 p-3">
                {card.chart}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
