# Plan: Redo Analytics Page with base shadcn/ui elements

## Phase 1: Foundation & Data Layer
- [x] Task: Define Types and Data Mocks 5ae8076
    - [x] Sub-task: Create TypeScript interfaces for the proposed metrics (Total Conversations, Total Messages, Active Conversations, etc.).
    - [x] Sub-task: Setup Vitest mocks for the required Convex queries (`api.conversations.getConversations`, `api.messages.getAllMessages`).
- [ ] Task: Conductor - User Manual Verification 'Foundation & Data Layer' (Protocol in workflow.md)

## Phase 2: Core Metric Components (TDD)
- [ ] Task: Implement Reusable Stat Cards
    - [ ] Sub-task: Write tests for a `StatCard` component that displays a label, value, and optional trend.
    - [ ] Sub-task: Implement the `StatCard` using shadcn/ui `Card` and `Badge`.
- [ ] Task: Analytics Metric Logic
    - [ ] Sub-task: Write tests for the logic that calculates metrics from raw Convex data.
    - [ ] Sub-task: Implement the calculation logic within the `AnalyticsPage` component.
- [ ] Task: Conductor - User Manual Verification 'Core Metric Components' (Protocol in workflow.md)

## Phase 3: Visualizations (TDD)
- [ ] Task: Implement Activity Chart
    - [ ] Sub-task: Write tests for the data transformation logic (aggregating messages into a "per-day" format for the last 7 days).
    - [ ] Sub-task: Implement the chart visualization using Recharts (or similar) integrated with shadcn/ui styling.
- [ ] Task: Conductor - User Manual Verification 'Visualizations' (Protocol in workflow.md)

## Phase 4: Layout Refactoring & Polish
- [ ] Task: Redesign Page Shell
    - [ ] Sub-task: Refactor the main `AnalyticsPage` layout to use shadcn/ui `Tabs` for view switching and `Separator` for hierarchy.
    - [ ] Sub-task: Ensure full mobile responsiveness for all new components.
- [ ] Task: Final Cleanup
    - [ ] Sub-task: Remove any remaining custom CSS or legacy code from the previous analytics implementation.
- [ ] Task: Conductor - User Manual Verification 'Layout Refactoring & Polish' (Protocol in workflow.md)
