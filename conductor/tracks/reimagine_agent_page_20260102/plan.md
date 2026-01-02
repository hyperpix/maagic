# Implementation Plan - Reimagine Agent Page

This plan outlines the steps to redesign the Agent configuration page into a 2-column layout with a vertical sidebar and a live interactive preview, including persistence of branding and appearance settings.

## Phase 1: Backend Infrastructure [checkpoint: 844f7a9]
- [x] Task: Update `convex/schema.ts` to include an `agentConfig` table for persisting branding and behavior settings. ad9879c
- [x] Task: Create `convex/agentConfig.ts` with `get` and `update` mutations. ad9879c
- [x] Task: Write unit tests for `agentConfig` mutations in `convex/agentConfig.test.ts`. ad9879c
- [x] Task: Implement the `get` and `update` mutations to pass tests. ad9879c
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Infrastructure' (Protocol in workflow.md) ad9879c

## Phase 2: Layout & Navigation Refactor [checkpoint: 071a023]
- [x] Task: Create a new `AgentLayout` component that supports a 2-column structure (Settings vs. Preview). 8b2ebab
- [x] Task: Implement a vertical sidebar component for navigating settings sections (Behavior, Knowledge, Appearance). 8b2ebab
- [x] Task: Refactor `web/src/components/agent-page.tsx` to use the new layout and sidebar. 8b2ebab
- [x] Task: Write tests to ensure navigation correctly switches between settings sections. 8b2ebab
- [x] Task: Conductor - User Manual Verification 'Phase 2: Layout & Navigation Refactor' (Protocol in workflow.md) 8b2ebab

## Phase 3: Appearance Section & Local State [checkpoint: 9594ead]
- [x] Task: Build the "Appearance" configuration form (Identity, Branding, Styling, Legal). 2b2a8e9
- [x] Task: Implement a local state manager (e.g., a hook) in `AgentPage` to handle real-time form updates for the preview. 2b2a8e9
- [x] Task: Write tests for the Appearance form inputs and state synchronization. 2b2a8e9
- [x] Task: Conductor - User Manual Verification 'Phase 3: Appearance Section & Local State' (Protocol in workflow.md) 2b2a8e9

## Phase 4: Live Preview Integration
- [ ] Task: Refactor the existing chat widget component to accept dynamic theme and branding props (colors, title, etc.).
- [ ] Task: Embed the interactive chat widget in the right-hand "Live Preview" column.
- [ ] Task: Connect the local form state to the Preview component for real-time visual updates.
- [ ] Task: Write tests to verify the Preview updates styling correctly when form values change.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Live Preview Integration' (Protocol in workflow.md)

## Phase 5: Data Persistence & Integration
- [ ] Task: Wire up the "Save" logic (e.g., a "Save Changes" button or debounced updates) to call Convex mutations.
- [ ] Task: Ensure "Behavior" and "Knowledge" settings are also correctly persisted in the new `agentConfig` schema.
- [ ] Task: Implement initial data loading to populate the forms from the database on page load.
- [ ] Task: Perform final UI/UX polish, ensuring responsiveness and consistent styling.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Data Persistence & Integration' (Protocol in workflow.md)
