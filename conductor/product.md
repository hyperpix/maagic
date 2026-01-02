# Initial Concept

You are a senior full-stack engineer. Build a SIMPLE live chat support platform using:
- Next.js (App Router, TypeScript)
- Convex (realtime backend)
- shadcn/ui ONLY for UI components
- Tailwind CSS
- No auth (v1)
- No bots, no integrations, no extra features

GOAL: A minimal Intercom-like live chat MVP with:
1) A visitor chat widget (floating bottom-right)
2) An admin inbox dashboard
3) Realtime messaging using Convex subscriptions

–––––––––––––––– DATA MODEL (Convex) ––––––––––––––––
Create Convex tables:
1) conversations
   - visitorId: string
   - createdAt: number
2) messages
   - conversationId: Id<"conversations">
   - sender: "visitor" | "agent"
   - content: string
   - createdAt: number
3) agentConfig
   - title: string
   - description: string
   - logoUrl: string
   - primaryColor: string
   - backgroundColor: string
   - greetingMessage: string
   - baseInstructions: string
   - model: string
   - temperature: number
   - maxTokens: number

–––––––––––––––– CONVEX FUNCTIONS ––––––––––––––––
1) mutation: createConversation(visitorId)
2) mutation: sendMessage(conversationId, sender, content)
3) query: getConversation

PAGES ––––––––––––––––
1) Visitor Widget
   - Floating circular button at bottom-right
   - On click, opens a small chat modal
   - If no conversation exists:
     - generate visitorId
     - create conversation
   - Message list (scrollable)
   - Text input + send button
   - Messages update in realtime

2) Admin Inbox (/admin)
   - Two-column layout:
     - Left: list of conversations
     - Right: messages for selected conversation
     - Input box for agent reply
     - Realtime updates when visitor sends messages

–––––––––––––––– UI REQUIREMENTS ––––––––––––––––
- Use shadcn/ui components only
- Clean, Stripe-like minimal design
- Small chat bubble
- Rounded cards
- Subtle borders
- No animations required

–––––––––––––––– IMPORTANT RULES ––––––––––––––––
- Keep everything minimal
- No auth
- No permissions logic
- No analytics
- No notifications
- No file uploads
- No emojis
- Focus o Clear folder structure
- Working realtime chat

This should be production-clean but intentionally minimal.

# Product Vision

## Target Users
- **Small Business Owners & Support Agents:** Need a simple way to manage and respond to incoming customer queries in real-time.
- **Website Visitors & Customers:** Need a low-friction way to start a conversation with the business.

## Success Metrics
- **Real-time Reliability:** Messages are delivered and updated instantly between visitors and admins without page refreshes.
- **UI Quality:** A clean, professional, and bug-free interface using shadcn/ui that feels robust despite its simplicity.
- **Developer Experience:** The project is easy to set up, deploy, and understand due to its minimal and clean architecture.

## Core Features
- **Visitor Chat Widget:** A floating UI component that allows visitors to initiate and maintain conversations. It remains closed by default to respect user space.
- **Admin Inbox:** A streamlined dashboard for managing multiple conversations, prioritized by activity (status-based).
- **Agent Configuration:** A robust admin interface to customize the agent's identity, branding, behavior, and knowledge base, with a real-time live preview.
- **Real-time Sync:** Powered by Convex to ensure data consistency across all clients.

## Key Constraints
- **Zero Auth:** No login or registration for either visitors or admins in this MVP.
- **No Complex Data:** No support for file uploads, emojis, or rich text.
- **No Analytics:** Focus is purely on functional communication, avoiding any reporting or tracking overhead.
