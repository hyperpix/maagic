# Implementation Plan - Core Live Chat MVP

## Phase 1: Project Scaffolding & Data Model
- [x] Task: Initialize Next.js app with Tailwind CSS and shadcn/ui a629d75
    - [x] Sub-task: Run `npx create-next-app@latest`
    - [x] Sub-task: Initialize shadcn/ui
- [x] Task: Set up Convex backend b560b04
    - [x] Sub-task: Install `convex` and initialize the project
    - [x] Sub-task: Define schema for `conversations` and `messages`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding & Data Model' (Protocol in workflow.md)

## Phase 2: Convex Backend Functions
- [ ] Task: Implement `createConversation` mutation
    - [ ] Sub-task: Write Tests for `createConversation`
    - [ ] Sub-task: Implement `createConversation`
- [ ] Task: Implement `sendMessage` mutation
    - [ ] Sub-task: Write Tests for `sendMessage`
    - [ ] Sub-task: Implement `sendMessage`
- [ ] Task: Implement `getMessages` query
    - [ ] Sub-task: Write Tests for `getMessages`
    - [ ] Sub-task: Implement `getMessages`
- [ ] Task: Implement `getConversations` query (Admin list)
    - [ ] Sub-task: Write Tests for `getConversations`
    - [ ] Sub-task: Implement `getConversations`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Convex Backend Functions' (Protocol in workflow.md)

## Phase 3: Visitor Chat Widget
- [ ] Task: Build Floating Action Button (FAB)
    - [ ] Sub-task: Write Tests for FAB
    - [ ] Sub-task: Implement FAB with shadcn/ui
- [ ] Task: Build Chat Modal & Message List
    - [ ] Sub-task: Write Tests for Chat Modal
    - [ ] Sub-task: Implement Chat Modal and scrollable message list
- [ ] Task: Integrate Visitor Message Sending
    - [ ] Sub-task: Write Tests for Message Input
    - [ ] Sub-task: Implement message input and `sendMessage` mutation call
- [ ] Task: Real-time Message Subscription
    - [ ] Sub-task: Write Tests for real-time updates
    - [ ] Sub-task: Implement `useQuery` subscription for messages
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Visitor Chat Widget' (Protocol in workflow.md)

## Phase 4: Admin Inbox Dashboard
- [ ] Task: Create /admin layout
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
