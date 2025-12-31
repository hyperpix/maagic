# Implementation Plan - Refactor Chat Widget with Assistant-UI

## Phase 1: Setup and Infrastructure
- [ ] Task: Install assistant-ui dependencies
    - [ ] Sub-task: Run `npm install @assistant-ui/react @assistant-ui/react-markdown`
    - [ ] Sub-task: Run `npx shadcn@latest add @assistant-ui/assistant-modal`
- [ ] Task: Configure project for assistant-ui
    - [ ] Sub-task: Update `tailwind.config.ts` or globals.css if required by shadcn components
    - [ ] Sub-task: Ensure `TooltipProvider` is available in `layout.tsx`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Setup and Infrastructure' (Protocol in workflow.md)

## Phase 2: Custom Convex Runtime
- [ ] Task: Implement `useConvexRuntime` hook
    - [ ] Sub-task: Write Tests for the runtime mapping (Convex messages -> Assistant-UI format)
    - [ ] Sub-task: Implement the `ExternalStoreAdapter` logic in `src/lib/use-chat-runtime.ts`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Custom Convex Runtime' (Protocol in workflow.md)

## Phase 3: Chat Widget Refactor
- [ ] Task: Replace custom UI with AssistantModal
    - [ ] Sub-task: Write Tests for `ChatWidget` rendering with the new modal
    - [ ] Sub-task: Update `ChatWidget.tsx` to use `AssistantRuntimeProvider` and `AssistantModal`
- [ ] Task: Ensure data persistence
    - [ ] Sub-task: Verify `visitorId` and `conversationId` are correctly passed to the runtime
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Chat Widget Refactor' (Protocol in workflow.md)

## Phase 4: Integration and Real-time Verification
- [ ] Task: Verify end-to-end messaging
    - [ ] Sub-task: Test sending a message from the widget and seeing it in `/admin`
    - [ ] Sub-task: Test replying from `/admin` and seeing it in the widget in real-time
- [ ] Task: Final Polish
    - [ ] Sub-task: Remove obsolete custom chat components and styles
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration and Real-time Verification' (Protocol in workflow.md)
