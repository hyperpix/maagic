"use client"

import { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert"
import { 
  CreditCard,
  Clock,
  Globe,
  MessageSquare,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  BarChart,
  Inbox,
  Info,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages = useQuery(api.messages.getAllMessages)

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalConversations = conversations?.length || 0
    const totalMessages = allMessages?.length || 0
    const avgMessagesPerChat = totalConversations > 0 ? (totalMessages / totalConversations).toFixed(1) : "0"
    
    const totalSeconds = totalMessages * 30 
    const avgSecondsPerChat = totalConversations > 0 ? (totalSeconds / totalConversations).toFixed(0) : "0"
    const totalMinutes = Math.round(totalSeconds / 60)
    
    return {
      creditsUsed: totalMinutes,
      totalMinutes,
      websiteTraffic: 0,
      totalMessages,
      totalConversations,
      avgMessagesPerChat,
      avgSecondsPerChat,
    }
  }, [conversations, allMessages])

  const overviewMetrics = [
    { 
      name: "Credits Used", 
      value: metrics.creditsUsed.toString(), 
      icon: CreditCard, 
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      change: "+12%",
      trend: "up"
    },
    { 
      name: "Total Minutes", 
      value: metrics.totalMinutes.toString(), 
      icon: Clock, 
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      change: "+5%",
      trend: "up"
    },
    { 
      name: "Website Traffic", 
      value: metrics.websiteTraffic.toString(), 
      icon: Globe, 
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      change: "0%",
      trend: "neutral"
    },
    { 
      name: "Total Messages", 
      value: metrics.totalMessages.toString(), 
      icon: MessageSquare, 
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      change: "+18%",
      trend: "up"
    },
  ]

  const secondaryMetrics = [
    { name: "Total Conversations", value: metrics.totalConversations.toString(), icon: Users },
    { name: "Avg Messages/Chat", value: metrics.avgMessagesPerChat, icon: BarChart3 },
    { name: "Avg Seconds/Chat", value: metrics.avgSecondsPerChat, icon: Clock },
  ]

  const EmptyState = ({ message }: { message: string }) => (
    <Alert variant="mono" className="bg-muted/30 border-none rounded-2xl py-8">
      <div className="flex flex-col items-center text-center w-full">
        <Inbox className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <AlertTitle className="text-muted-foreground/80 font-medium">Insufficient Data</AlertTitle>
        <AlertDescription className="text-muted-foreground/60 italic text-xs max-w-[250px] mt-1">
          {message}
        </AlertDescription>
      </div>
    </Alert>
  )

  const softCardClasses = "rounded-[2rem] border-none shadow-soft transition-all duration-300 hover:shadow-md dark:bg-card/50"

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-lg">Performance insights and visitor engagement data.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-muted/50 p-1 rounded-full h-11">
            <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="engagement" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Engagement</TabsTrigger>
            <TabsTrigger value="conversations" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">Conversations</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator className="opacity-50" />

      <Tabs value={activeTab} className="w-full space-y-10">
        <TabsContent value="overview" className="m-0 space-y-10 focus-visible:ring-0">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewMetrics.map((stat) => (
              <Card key={stat.name} className={softCardClasses}>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <Badge variant="secondary" className="rounded-full font-bold px-2 py-0.5 text-[10px] bg-muted/50 text-muted-foreground">
                      {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-500" /> : stat.trend === "down" ? <ArrowDownRight className="h-3 w-3 mr-0.5 text-rose-500" /> : null}
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-4xl font-bold tracking-tight mt-1">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary Stats & Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className={cn(softCardClasses, "xl:col-span-2")}>
              <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Visual representation of agent activity over time.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="rounded-full border-muted text-muted-foreground">Last 7 Days</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 pt-4">
                <div className="h-64 relative rounded-[1.5rem] flex items-center justify-center overflow-hidden bg-muted/5 border border-muted/10 shadow-inner group">
                  <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="mainStatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 180 Q 100 160 200 180 T 400 170"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 180 Q 100 160 200 180 T 400 170 V 200 H 0 Z"
                      fill="url(#mainStatGradient)"
                    />
                  </svg>
                  <EmptyState message="No activity recorded in the selected period." />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground px-2">Key Ratios</h3>
              {secondaryMetrics.map((stat) => (
                <Card key={stat.name} className={cn(softCardClasses, "hover:scale-[1.01]")}>
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-muted/50">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.name}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="m-0 focus-visible:ring-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className={softCardClasses}>
              <CardHeader className="p-8">
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User progression through the chat experience.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-10 space-y-10">
                <div className="space-y-4">
                  <div className="h-8 bg-muted/20 rounded-full p-1.5 shadow-inner relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary/30 to-primary rounded-full w-[10%] transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between px-1">
                    {['Views', 'Clicks', 'Starts', 'Resolved'].map((label) => (
                      <span key={label} className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{label}</span>
                    ))}
                  </div>
                </div>
                <EmptyState message="Start receiving messages to see your funnel data." />
              </CardContent>
            </Card>

            <Card className={softCardClasses}>
              <CardHeader className="p-8">
                <CardTitle>Traffic Source Breakdown</CardTitle>
                <CardDescription>Where your chat users are coming from.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex items-center justify-center min-h-[300px]">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="24" className="text-muted/10" />
                    <circle cx="96" cy="96" r="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="24" strokeDasharray="502.4" strokeDashoffset="480" strokeLinecap="round" className="opacity-20" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-muted-foreground/20">0%</span>
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">No Traffic</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="m-0 focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {[
              { title: "Engagement Depth", desc: "Messages per session distribution.", label: "Frequency" },
              { title: "Session Duration", desc: "Time spent per interaction.", label: "Duration" },
              { title: "Peak Activity", desc: "Hours with most conversations.", label: "Hot Zones" }
            ].map((box) => (
              <Card key={box.title} className={softCardClasses}>
                <CardHeader className="p-8">
                  <CardTitle>{box.title}</CardTitle>
                  <CardDescription>{box.desc}</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                  <div className="h-48 flex items-end justify-around gap-4 group">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 bg-muted/20 rounded-2xl relative overflow-hidden h-full">
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/10 rounded-t-2xl h-[10%] group-hover:bg-primary/20 transition-all duration-500" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col items-center gap-1">
                    <Badge variant="mono" className="bg-muted/50 text-muted-foreground/60 text-[10px] uppercase tracking-widest">{box.label}</Badge>
                    <p className="text-xs text-muted-foreground/40 font-medium italic mt-2">Awaiting data...</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}