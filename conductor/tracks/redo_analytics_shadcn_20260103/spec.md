# Specification: Redo Analytics Page with base shadcn/ui elements

## Overview
The goal of this track is to completely refactor the existing analytics page to use standard shadcn/ui components. This will improve visual consistency across the application, simplify the codebase by removing custom/ad-hoc styling, and ensure better maintainability.

## User Persona
- **Admin/Support Agent:** Needs a clear, professional-looking dashboard to monitor system activity and message volume.

## Functional Requirements
- **Standardized UI:** Replace custom card and layout elements with shadcn/ui `Card`, `Tabs`, `Separator`, etc.
- **Metric Display:** Display key performance indicators (KPIs) using a consistent layout.
- **Data Visualizations:** Use shadcn-compatible charting (e.g., Recharts) for activity over time.
- **Responsive Layout:** Ensure the dashboard is fully responsive and looks great on all screen sizes.
- **Real-time Data:** Maintain existing integration with Convex queries to ensure data remains live.

## Proposed Metrics (based on available data)
- **Total Conversations:** Number of unique conversation entries.
- **Total Messages:** Total count of messages across all conversations.
- **Active Conversations:** Conversations with activity in the last 24 hours.
- **Average Messages per Conversation:** A ratio of total messages to total conversations.
- **Activity Chart:** Messages sent per day over the last 7 days.

## Non-Functional Requirements
- **Visual Consistency:** Match the "Stripe-like minimal design" mentioned in the product vision.
- **Performance:** Ensure chart rendering does not negatively impact page responsiveness.
- **Type Safety:** Ensure all props and data fetching are strictly typed.

## Acceptance Criteria
- [ ] The analytics page is visually indistinguishable from a standard shadcn/ui dashboard.
- [ ] All metrics update in real-time as new messages/conversations are added.
- [ ] The layout is responsive (mobile, tablet, desktop).
- [ ] Code coverage for the new components is >80%.
- [ ] No custom CSS is used where shadcn/ui or Tailwind utilities suffice.

## Out of Scope
- Adding new complex tracking (e.g., user session tracking, heatmaps).
- Authentication or permission logic (per MVP constraints).
- Exporting data to CSV/PDF.
