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

## Phase 4: Admin Inbox Dashboard
- [~] Task: Create /admin layout
    - [ ] Sub-task: Write Tests for admin layout
    - [ ] Sub-task: Implement two-column layout with shadcn/ui
- [ ] Task: Implement Conversation List (Left Column)
    - [ ] Sub-task: Write Tests for conversation list
    - [ ] Sub-task: Implement list with real-time updates
- [ ] Task: Implement Message View & Reply (Right Column)
    - [ ] Sub-task: Write Tests for message view
    - [ ] Sub-task: Implement message history and reply input
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Admin Inbox Dashboard' (Protocol in workflow.md)

## Phase 5: Final Integration & Polish
- [ ] Task: Style Refinement & Tone Check
    - [ ] Sub-task: Review against `product-guidelines.md`
    - [ ] Sub-task: Apply final Stripe-like styling tweaks
- [ ] Task: End-to-End Testing
    - [ ] Sub-task: Perform manual E2E test between visitor and admin
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Final Integration & Polish' (Protocol in workflow.md)
