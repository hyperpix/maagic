"use client"

import { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { 
  SoftCard, 
  SoftCardContent, 
  SoftCardDescription, 
  SoftCardHeader, 
  SoftCardTitle 
} from "@/components/ui/soft-card"
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
  Inbox
} from "lucide-react"

export function AnalyticsPage() {
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages = useQuery(api.messages.getAllMessages)

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const totalConversations = conversations?.length || 0
    const totalMessages = allMessages?.length || 0
    const avgMessagesPerChat = totalConversations > 0 ? (totalMessages / totalConversations).toFixed(1) : "0"
    
    // Calculate total seconds (mock - would need message timestamps)
    const totalSeconds = totalMessages * 30 // Assuming avg 30 seconds per message
    const avgSecondsPerChat = totalConversations > 0 ? (totalSeconds / totalConversations).toFixed(0) : "0"
    
    // Calculate total minutes (for credits)
    const totalMinutes = Math.round(totalSeconds / 60)
    
    return {
      creditsUsed: totalMinutes,
      totalMinutes,
      websiteTraffic: 0, // Would need separate tracking
      totalMessages,
      totalConversations,
      avgMessagesPerChat,
      avgSecondsPerChat,
    }
  }, [conversations, allMessages])

  // Overview metrics grid
  const overviewMetrics = [
    { name: "Credits Used", value: metrics.creditsUsed.toString(), icon: CreditCard, color: "bg-blue-50 text-blue-600" },
    { name: "Total Minutes", value: metrics.totalMinutes.toString(), icon: Clock, color: "bg-green-50 text-green-600" },
    { name: "Website Traffic", value: metrics.websiteTraffic.toString(), icon: Globe, color: "bg-purple-50 text-purple-600" },
    { name: "Total Messages", value: metrics.totalMessages.toString(), icon: MessageSquare, color: "bg-yellow-50 text-yellow-600" },
    { name: "Total Conversations", value: metrics.totalConversations.toString(), icon: Users, color: "bg-orange-50 text-orange-600" },
    { name: "Avg Messages/Chat", value: metrics.avgMessagesPerChat, icon: BarChart3, color: "bg-indigo-50 text-indigo-600" },
    { name: "Avg Seconds/Chat", value: metrics.avgSecondsPerChat, icon: Clock, color: "bg-rose-50 text-rose-600" },
  ]

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <p className="text-sm font-medium text-muted-foreground/60 italic max-w-[200px]">
        {message}
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto bg-background/50">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Analytics</h1>
        <p className="text-muted-foreground text-lg">Detailed insights into your AI agent's performance and user engagement.</p>
      </div>

      {/* Overview Metrics */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground/80">Overview Metrics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {overviewMetrics.map((stat) => (
            <SoftCard
              key={stat.name}
              className="hover:scale-[1.02] transition-transform duration-300"
            >
              <SoftCardContent className="pt-8 pb-6 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.name}</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{stat.value}</p>
                </div>
              </SoftCardContent>
            </SoftCard>
          ))}
        </div>
      </div>

      {/* User Engagement Funnel */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground/80">User Engagement</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <SoftCard className="flex-1">
            <SoftCardHeader>
              <SoftCardTitle>Engagement Funnel</SoftCardTitle>
              <SoftCardDescription>Track user progression from widget views to high engagement</SoftCardDescription>
            </SoftCardHeader>
            <SoftCardContent>
              <div className="space-y-8 pt-4">
                <div className="relative px-2">
                  {/* Gauge Track */}
                  <div className="h-6 bg-muted/30 rounded-full overflow-hidden p-1 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full transition-all duration-1000" style={{ width: '5%' }}></div>
                  </div>
                  {/* Ticks */}
                  <div className="flex justify-between mt-4 px-2">
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <div key={tick} className="flex flex-col items-center">
                        <div className="h-2 w-px bg-muted-foreground/30"></div>
                        <span className="text-[10px] font-bold text-muted-foreground/50 mt-1">{tick}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <EmptyState message="Funnel visualization will appear once more users interact with the widget." />
              </div>
            </SoftCardContent>
          </SoftCard>

          <SoftCard className="flex-1">
            <SoftCardHeader>
              <SoftCardTitle>Engagement Statistics</SoftCardTitle>
              <SoftCardDescription>Detailed breakdown of user engagement funnel metrics</SoftCardDescription>
            </SoftCardHeader>
            <SoftCardContent>
              <div className="space-y-6 pt-4">
                {/* Soft Bar Chart */}
                <div className="h-48 flex items-end justify-around gap-6 px-4">
                  {['Views', 'Clicks', 'Starts', 'Engaged'].map((label) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full bg-muted/20 rounded-3xl relative overflow-hidden h-full">
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-t-3xl transition-all duration-1000 group-hover:bg-primary/30" style={{ height: '15%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 text-center font-medium pt-2">
                  Insufficient data for comparative analysis
                </p>
              </div>
            </SoftCardContent>
          </SoftCard>
        </div>
      </div>

      {/* Conversation Metrics */}
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-2 px-2">
          <BarChart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground/80">Conversation Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <SoftCard>
            <SoftCardHeader>
              <SoftCardTitle>Total Conversations</SoftCardTitle>
              <SoftCardDescription>
                7-day trend of total interactions across all platforms.
              </SoftCardDescription>
            </SoftCardHeader>
            <SoftCardContent>
              <div className="space-y-6 pt-4">
                <div className="h-48 relative rounded-[2rem] flex items-center justify-center overflow-hidden bg-muted/5 border border-muted/20 shadow-inner">
                  <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="softGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 180 Q 100 170 200 180 T 400 175"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 180 Q 100 170 200 180 T 400 175 V 200 H 0 Z"
                      fill="url(#softGradient)"
                    />
                  </svg>
                  <EmptyState message="No recent activity detected in the last 7 days." />
                </div>
              </div>
            </SoftCardContent>
          </SoftCard>

          <SoftCard>
            <SoftCardHeader>
              <SoftCardTitle>User Retention</SoftCardTitle>
              <SoftCardDescription>
                Distribution of message count per conversation.
              </SoftCardDescription>
            </SoftCardHeader>
            <SoftCardContent>
              <div className="space-y-6 pt-4">
                <div className="h-48 flex items-end justify-around gap-6 px-4">
                  {['1-2', '3-5', '6-10', '11+'].map((range) => (
                    <div key={range} className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-full bg-primary/5 rounded-3xl relative h-full">
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-3xl transition-all duration-1000" style={{ height: '10%' }}></div>
                      </div>
                      <span className="text-xs font-bold text-muted-foreground/70">{range}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/60 text-center font-medium">
                  Message frequency data pending
                </p>
              </div>
            </SoftCardContent>
          </SoftCard>

          <SoftCard>
            <SoftCardHeader>
              <SoftCardTitle>Time Retention</SoftCardTitle>
              <SoftCardDescription>
                Duration distribution of user interactions.
              </SoftCardDescription>
            </SoftCardHeader>
            <SoftCardContent>
              <div className="space-y-6 pt-4">
                <div className="h-48 relative flex items-center justify-center bg-muted/5 rounded-[2rem] border border-muted/20 shadow-inner">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="10"
                      strokeDasharray="364.4"
                      strokeDashoffset="340"
                      strokeLinecap="round"
                      className="opacity-40"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <EmptyState message="Not enough duration data to display" />
                  </div>
                </div>
              </div>
            </SoftCardContent>
          </SoftCard>
        </div>
      </div>
    </div>
  )
}
