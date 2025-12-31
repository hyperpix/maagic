# Implementation Plan - Core Live Chat MVP

## Phase 1: Project Scaffolding & Data Model [checkpoint: 5af3f29]
- [x] Task: Initialize Next.js app with Tailwind CSS and shadcn/ui a629d75
    - [x] Sub-task: Run `npx create-next-app@latest`
    - [x] Sub-task: Initialize shadcn/ui
- [x] Task: Set up Convex backend b560b04
    - [x] Sub-task: Install `convex` and initialize the project
    - [x] Sub-task: Define schema for `conversations` and `messages`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding & Data Model' (Protocol in workflow.md) 5af3f29

## Phase 2: Convex Backend Functions [checkpoint: 1137204]
- [x] Task: Implement `createConversation` mutation d563bbe
    - [x] Sub-task: Write Tests for `createConversation`
    - [x] Sub-task: Implement `createConversation`
- [x] Task: Implement `sendMessage` mutation c60d2b8
    - [x] Sub-task: Write Tests for `sendMessage`
    - [x] Sub-task: Implement `sendMessage`
- [x] Task: Implement `getMessages` query 52b9bc3
    - [x] Sub-task: Write Tests for `getMessages`
    - [x] Sub-task: Implement `getMessages`
- [x] Task: Implement `getConversations` query (Admin list) 4a428e5
    - [x] Sub-task: Write Tests for `getConversations`
    - [x] Sub-task: Implement `getConversations`
- [x] Task: Conductor - User Manual Verification 'Phase 2: Convex Backend Functions' (Protocol in workflow.md) 1137204

## Phase 3: Visitor Chat Widget [checkpoint: fdb9e13]
- [x] Task: Build Floating Action Button (FAB) cf90238
    - [x] Sub-task: Write Tests for FAB
    - [x] Sub-task: Implement FAB with shadcn/ui
- [x] Task: Build Chat Modal & Message List 25be2a4
    - [x] Sub-task: Write Tests for Chat Modal
    - [x] Sub-task: Implement Chat Modal and scrollable message list
- [x] Task: Integrate Visitor Message Sending f7970f2
    - [x] Sub-task: Write Tests for Message Input
    - [x] Sub-task: Implement message input and `sendMessage` mutation call
- [x] Task: Real-time Message Subscription a95babf
    - [x] Sub-task: Write Tests for real-time updates
    - [x] Sub-task: Implement `useQuery` subscription for messages
- [x] Task: Conductor - User Manual Verification 'Phase 3: Visitor Chat Widget' (Protocol in workflow.md) fdb9e13

## Phase 4: Admin Inbox Dashboard [checkpoint: 53ee27d]
- [x] Task: Create /admin layout 6cfbb71
    - [x] Sub-task: Write Tests for admin layout
    - [x] Sub-task: Implement two-column layout with shadcn/ui
- [x] Task: Implement Conversation List (Left Column) cc60623
    - [x] Sub-task: Write Tests for conversation list
    - [x] Sub-task: Implement list with real-time updates
- [x] Task: Implement Message View & Reply (Right Column) 2ea0a90
    - [x] Sub-task: Write Tests for message view
    - [x] Sub-task: Implement message history and reply input
- [x] Task: Conductor - User Manual Verification 'Phase 4: Admin Inbox Dashboard' (Protocol in workflow.md) 53ee27d

## Phase 5: Refactor ChatWidget with assistant-ui [checkpoint: f63fb4a]
- [x] Task: Install and initialize assistant-ui f63fb4a
    - [x] Sub-task: Install `@assistant-ui/react` and `@assistant-ui/assistant-modal`
    - [x] Sub-task: Run shadcn initialization for assistant-ui
- [x] Task: Refactor ChatWidget to use AssistantModal f63fb4a
    - [x] Sub-task: Implement a custom Convex runtime for assistant-ui
    - [x] Sub-task: Replace custom Card/ScrollArea with AssistantModal
- [x] Task: Conductor - User Manual Verification 'Phase 5: Refactor ChatWidget with assistant-ui' (Protocol in workflow.md) f63fb4a

## Phase 6: Final Integration & Polish
- [~] Task: Style Refinement & Tone Check
    - [x] Sub-task: Review against `product-guidelines.md`
    - [x] Sub-task: Apply final Stripe-like styling tweaks (Removed boilerplate)
- [ ] Task: End-to-End Testing
    - [ ] Sub-task: Perform manual E2E test between visitor and admin
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Integration & Polish' (Protocol in workflow.md)
