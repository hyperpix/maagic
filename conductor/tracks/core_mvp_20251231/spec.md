# Specification: Core Live Chat MVP

## Overview
This track implements the foundational elements of a real-time live chat support platform. It includes a visitor-facing chat widget and an admin-facing inbox dashboard, all powered by a Convex real-time backend.

## Functional Requirements
- **Real-time Messaging:** Messages must be delivered instantly between the visitor widget and the admin dashboard without page refreshes.
- **Visitor Widget:**
    - Floating circular button at the bottom-right of the screen.
    - Opens a chat modal upon clicking.
    - Generates a unique `visitorId` and creates a conversation if one doesn't exist.
    - Displays a scrollable list of messages.
    - Provides a text input and send button.
- **Admin Inbox:**
    - Two-column layout:
        - Left: List of conversations (status-based or active first).
        - Right: Detailed message history for the selected conversation.
    - Input box for the agent to reply.
- **Data Model (Convex):**
    - `conversations` table: `visitorId` (string), `createdAt` (number).
    - `messages` table: `conversationId` (Id<"conversations">), `sender` ("visitor" | "agent"), `content` (string), `createdAt` (number).

## Non-Functional Requirements
- **Performance:** Real-time updates should feel instantaneous.
- **UI/UX:** Clean, modern minimalist (Stripe-like) design using `shadcn/ui`. Friendly and supportive tone in microcopy.
- **Reliability:** Use Convex subscriptions for robust data synchronization.

## Acceptance Criteria
- [ ] A visitor can open the chat widget and send a message.
- [ ] The message appears instantly in the admin dashboard.
- [ ] An admin can reply to the visitor's message.
- [ ] The reply appears instantly in the visitor's chat widget.
- [ ] Conversations are correctly persisted in the Convex database.

## Out of Scope
- User authentication (v1 is no-auth).
- File uploads, emojis, or rich text.
- Analytics or notifications.
- Bot integrations.
