import { describe, it, expectTypeOf } from 'vitest';
import type { AnalyticsMetrics, DailyActivity } from './analytics';

describe('Analytics Types', () => {
  it('should have the correct structure', () => {
    expectTypeOf<AnalyticsMetrics>().toHaveProperty('totalConversations');
    expectTypeOf<AnalyticsMetrics>().toHaveProperty('totalMessages');
    expectTypeOf<AnalyticsMetrics>().toHaveProperty('activeConversations');
    expectTypeOf<AnalyticsMetrics>().toHaveProperty('avgMessagesPerConversation');
    expectTypeOf<AnalyticsMetrics>().toHaveProperty('activityHistory');
    
    expectTypeOf<DailyActivity>().toHaveProperty('date');
    expectTypeOf<DailyActivity>().toHaveProperty('count');
  });
});
