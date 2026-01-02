# Implementation Plan - Reimagine Analytics Page

This plan outlines the steps to redesign the Analytics page to achieve a "soft" aesthetic with large rounded corners, diffused shadows, and increased whitespace, while maintaining all existing data points.

## Phase 1: Design System Foundations
- [x] Task: Write tests for `SoftCard` component 13ee304 to ensure correct class application.
- [x] Task: Implement `SoftCard` component 13ee304 in `web/src/components/ui/soft-card.tsx` with `rounded-3xl` and custom soft shadows.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Design System Foundations' (Protocol in workflow.md)

## Phase 2: Overview & Layout Implementation
- [ ] Task: Write tests for the new `AnalyticsPage` layout and metrics display.
- [ ] Task: Refactor `web/src/components/analytics-page.tsx` layout for increased whitespace and hierarchical spacing.
- [ ] Task: Implement the "Overview Metrics" section using the `SoftCard` component.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Overview & Layout Implementation' (Protocol in workflow.md)

## Phase 3: Soft Visualizations & Empty States
- [ ] Task: Write tests for the updated chart components and empty state visibility.
- [ ] Task: Redesign "User Engagement" and "Conversation Metrics" SVG charts with smooth curves, soft gradients, and rounded bars.
- [ ] Task: Update the "Not enough data" empty states to match the soft aesthetic.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Soft Visualizations & Empty States' (Protocol in workflow.md)

## Phase 4: Final Polish & Responsiveness
- [ ] Task: Audit and adjust spacing and radii for mobile responsiveness.
- [ ] Task: Perform final UI/UX pass to ensure "soft" feel across all interactions.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish & Responsiveness' (Protocol in workflow.md)
