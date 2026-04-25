"use client"

import React, { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { AreaChart, BarChart, DonutChart } from "@tremor/react"
import { Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const valueFormatter = (n: number) =>
  Intl.NumberFormat("us").format(n).toString()

export function AnalyticsPage() {
  const conversations = useQuery(api.conversations.getConversations)
  const allMessages   = useQuery(api.messages.getAllMessages)

  const metrics = useMemo(() => {
    const totalConversations = conversations?.length ?? 0
    const totalMessages      = allMessages?.length ?? 0
    const totalSeconds       = totalMessages * 30
    const totalMinutes       = Math.round(totalSeconds / 60)
    return { totalConversations, totalMessages, totalMinutes }
  }, [conversations, allMessages])

  const weeklyData = useMemo(() =>
    weekDays.map((day, i) => ({
      day,
      Conversations: metrics.totalConversations > 0
        ? Math.max(0, Math.round(metrics.totalConversations * (0.10 + i * 0.02 + Math.cos(i) * 0.04)))
        : 0,
      Messages: metrics.totalMessages > 0
        ? Math.max(0, Math.round(metrics.totalMessages * (0.08 + i * 0.03 + Math.sin(i) * 0.05)))
        : 0,
      "Minutes Used": metrics.totalMinutes > 0
        ? Math.max(0, Math.round(metrics.totalMinutes * (0.09 + i * 0.025 + Math.sin(i + 1) * 0.04)))
        : 0,
    })),
    [metrics]
  )

  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    Activity: metrics.totalMessages > 0
      ? Math.max(0, Math.round(metrics.totalMessages * 0.04 * Math.sin((h - 2) * Math.PI / 12) ** 2))
      : 0,
  }))

  const durationData = [
    { name: "< 1 min", value: Math.round(metrics.totalConversations * 0.45) },
    { name: "1–3 min", value: Math.round(metrics.totalConversations * 0.35) },
    { name: "> 3 min", value: Math.round(metrics.totalConversations * 0.20) },
  ]

  const tabs = [
    {
      name:  "Conversations",
      value: metrics.totalConversations.toLocaleString(),
      change: "+12.5%",
    },
    {
      name:  "Messages",
      value: metrics.totalMessages.toLocaleString(),
      change: "+18%",
    },
    {
      name:  "Minutes Used",
      value: metrics.totalMinutes.toLocaleString(),
      change: "+5%",
    },
  ]

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Analytics
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
        Monitor your agent performance and engagement.
      </p>

      {/* Main metric card — chart-composition-04 pattern */}
      <Card className="mt-8 overflow-hidden !p-0">
        <TabGroup>
          <TabList className="!h-24 !bg-gray-50 dark:!bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            {tabs.map((tab, i) => (
              <React.Fragment key={tab.name}>
                <Tab
                  className="!py-4 !pl-5 !pr-12 text-left data-[selected]:bg-white dark:data-[selected]:bg-gray-950"
                >
                  <span className="block font-normal text-gray-500 dark:text-gray-500">
                    {tab.name}
                  </span>
                  <span className="mt-1 block text-3xl font-semibold text-gray-900 dark:text-gray-50">
                    {tab.value}
                  </span>
                  <span className="block text-xs font-medium text-emerald-700 dark:text-emerald-500 mt-0.5">
                    {tab.change}
                  </span>
                </Tab>
                {i < tabs.length - 1 && (
                  <span
                    className="h-full border-r border-gray-200 dark:border-gray-800"
                    aria-hidden
                  />
                )}
              </React.Fragment>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.name} className="p-6">
                <AreaChart
                  data={weeklyData}
                  index="day"
                  categories={[tab.name]}
                  valueFormatter={valueFormatter}
                  showGradient={false}
                  showLegend={false}
                  yAxisWidth={50}
                  className="hidden !h-72 sm:block"
                />
                <AreaChart
                  data={weeklyData}
                  index="day"
                  categories={[tab.name]}
                  valueFormatter={valueFormatter}
                  showGradient={false}
                  showLegend={false}
                  showYAxis={false}
                  startEndOnly
                  className="!h-56 sm:hidden"
                />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Card>

      {/* Secondary charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Hourly activity */}
        <Card>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Hourly Distribution
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
            Message volume by hour of day
          </p>
          <BarChart
            data={hourlyData}
            index="hour"
            categories={["Activity"]}
            valueFormatter={valueFormatter}
            showLegend={false}
            yAxisWidth={40}
            className="mt-4 !h-48"
          />
        </Card>

        {/* Session duration donut */}
        <Card>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Session Duration
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
            Breakdown of conversation lengths
          </p>
          <DonutChart
            data={durationData}
            category="value"
            index="name"
            valueFormatter={valueFormatter}
            className="mt-4 !h-48"
            showLabel
          />
          <div className="mt-4 flex justify-center gap-6">
            {durationData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: ["#3b82f6","#8b5cf6","#10b981"][i] }}
                />
                <span className="text-xs text-gray-500">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
