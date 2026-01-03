export interface DailyActivity {
  date: string;
  count: number;
}

export interface AnalyticsMetrics {
  totalConversations: number;
  totalMessages: number;
  activeConversations: number;
  avgMessagesPerConversation: string;
  avgSecondsPerChat: string;
  activityHistory: DailyActivity[];
}
