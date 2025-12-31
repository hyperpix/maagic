# Specification: Refactor Chat Widget with Assistant-UI

## Overview
This track refactors the existing custom Visitor Chat Widget to use the polished `@assistant-ui/assistant-modal` component. The goal is to provide a more modern, AI-inspired UI while maintaining the existing Convex real-time backend.

## Functional Requirements
- **Assistant-UI Integration:** Replace the custom FAB and Modal with the `AssistantModal` from `@assistant-ui`.
- **Custom Convex Runtime:** Implement a bridge between our Convex backend (conversations, messages) and the `assistant-ui` runtime expectations.
- **Real-time Synchronization:** Ensure messages sent from the widget are saved to Convex and messages from the `/admin` dashboard appear instantly in the widget.
- **Markdown Support:** Leverage the built-in markdown rendering capabilities of `assistant-ui`.

## Non-Functional Requirements
- **Visual Aesthetic:** Maintain a polished, professional look consistent with `assistant-ui` defaults.
- **Minimal Complexity:** Exclude support for attachments and feedback to keep the implementation stable and focused on core chat.

## Acceptance Criteria
- [ ] The chat widget is replaced by the `AssistantModal`.
- [ ] A visitor can type and send messages, which are persisted in the Convex `messages` table.
- [ ] A visitor can see agent replies sent from the `/admin` dashboard in real-time.
- [ ] Existing `visitorId` and `conversationId` persistence (localStorage) is preserved.

## Out of Scope
- File attachments or rich media uploads.
- Message feedback (positive/negative ratings).
- Changes to the `/admin` dashboard UI (though the admin reply logic must still work).
