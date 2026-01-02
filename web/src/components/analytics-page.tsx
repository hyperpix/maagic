"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const overviewMetrics = [
  {
    name: "Credits Used",
    value: "0",
  },
  {
    name: "Total Minutes",
    value: "0",
  },
  {
    name: "Website Traffic",
    value: "0",
  },
  {
    name: "Total Messages",
    value: "0",
  },
  {
    name: "Total Conversations",
    value: "0",
  },
  {
    name: "Avg Messages/Chat",
    value: "0",
  },
  {
    name: "Avg Seconds/Chat",
    value: "0",
  },
]

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Overview Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Overview Metrics</h2>
        <div className="mx-auto grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {overviewMetrics.map((stat, index) => (
            <Card
              key={stat.name}
              className="rounded-none border-0 shadow-none py-0"
            >
              <CardContent className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 p-4 sm:p-6">
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </div>
                <div className="w-full flex-none text-3xl font-medium tracking-tight text-foreground">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* User Engagement */}
      <div>
        <h2 className="text-lg font-semibold mb-4">User Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Funnel</CardTitle>
              <CardDescription>Track user progression from widget views to high engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  {/* Gauge Track */}
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '0%' }}></div>
                  </div>
                  {/* Ticks */}
                  <div className="flex justify-between mt-2">
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <div key={tick} className="flex flex-col items-center">
                        <div className="h-2 w-px bg-border"></div>
                        <span className="text-xs text-muted-foreground mt-1">{tick}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Not enough data to show this chart
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Engagement Statistics</CardTitle>
              <CardDescription>Detailed breakdown of user engagement funnel metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2">
                  {['Views', 'Clicks', 'Starts', 'Engaged'].map((label, index) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-muted rounded-t" style={{ height: '0%' }}></div>
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Not enough data to show this chart
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conversation Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Conversation Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Conversations</CardTitle>
              <CardDescription>
                Number of total conversations your AI agent has had across all platforms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Line Chart */}
                <div className="h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="conversationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={40 + i * 40}
                        x2="400"
                        y2={40 + i * 40}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}
                    {/* Area under line (empty) */}
                    <path
                      d="M 0 200 L 400 200 L 400 200 Z"
                      fill="url(#conversationGradient)"
                    />
                    {/* X-axis labels */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <text
                        key={day}
                        x={(i * 400) / 6 + 20}
                        y="195"
                        fontSize="10"
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                      >
                        {day}
                      </text>
                    ))}
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Not enough data to show this chart
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>
                Total messages back and forth before the user leave the conversation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2">
                  {['1-2', '3-5', '6-10', '11+'].map((range, index) => (
                    <div key={range} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-primary rounded-t" style={{ height: '0%' }}></div>
                      <span className="text-xs text-muted-foreground">{range}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Not enough data to show this chart
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Time Retention</CardTitle>
              <CardDescription>
                Seconds passed users have spent interacting with the agent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Line Chart */}
                <div className="h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="timeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={40 + i * 40}
                        x2="400"
                        y2={40 + i * 40}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}
                    {/* Area under line (empty) */}
                    <path
                      d="M 0 200 L 400 200 L 400 200 Z"
                      fill="url(#timeGradient)"
                    />
                    {/* X-axis labels */}
                    {['0-30s', '30-60s', '1-2m', '2-5m', '5m+'].map((time, i) => (
                      <text
                        key={time}
                        x={(i * 400) / 4 + 50}
                        y="195"
                        fontSize="10"
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                      >
                        {time}
                      </text>
                    ))}
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Not enough data to show this chart
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

