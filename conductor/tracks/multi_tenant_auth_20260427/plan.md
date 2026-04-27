# Plan: Multi-Tenant Auth + Orgs + Agents

## Phase 1: Auth Foundation
- [ ] Task: Install auth dependencies
    - [ ] Sub-task: `npm install @convex-dev/auth @auth/core resend`
    - [ ] Sub-task: `npx shadcn@latest add login-02`
    - [ ] Sub-task: Set CONVEX_AUTH_ADAPTER_SECRET, RESEND_API_KEY, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET in env
- [ ] Task: Bootstrap Convex Auth
    - [ ] Sub-task: Create `convex/auth.ts` with Password + Google providers
    - [ ] Sub-task: Create `convex/http.ts` with auth HTTP routes
    - [ ] Sub-task: Run `npx convex dev` to verify auth schema deploys cleanly
- [ ] Task: Update ConvexClientProvider
    - [ ] Sub-task: Replace `ConvexProvider` with `ConvexAuthProvider` in `src/components/ConvexClientProvider.tsx`
- [ ] Task: Create auth pages
    - [ ] Sub-task: `src/app/(auth)/login/page.tsx` — wire login-02 to `useAuthActions().signIn`
    - [ ] Sub-task: `src/app/(auth)/signup/page.tsx` — wire login-02 to `useAuthActions().signIn` with `flow: "signUp"`
    - [ ] Sub-task: `src/app/(auth)/forgot/page.tsx` — password reset request form
    - [ ] Sub-task: `src/app/(auth)/reset/page.tsx` — password reset confirm form
- [ ] Task: Create Next.js middleware
    - [ ] Sub-task: `src/middleware.ts` — guard `/(admin)` routes, allow `/(auth)`, `/widget`, `/`, `/chat`
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Auth Foundation'

## Phase 2: Schema Overhaul
- [ ] Task: Update `convex/schema.ts`
    - [ ] Sub-task: Add `...authTables` spread from `@convex-dev/auth/server`
    - [ ] Sub-task: Add `organizations` table with slug index
    - [ ] Sub-task: Add `organizationMembers` table with all three indexes
    - [ ] Sub-task: Add `invitations` table with token/org/email indexes
    - [ ] Sub-task: Add `agents` table (org-scoped, includes all former agentConfig fields)
    - [ ] Sub-task: Update `conversations` — add `agentId: v.optional(v.id("agents"))` (optional for migration window)
    - [ ] Sub-task: Update `knowledge` — add `agentId: v.optional(v.id("agents"))` (optional for migration window)
    - [ ] Sub-task: Deploy schema with `npx convex dev`, verify no errors
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Schema Overhaul'

## Phase 3: Data Migration (Clean Slate)
- [ ] Task: Write and run migration mutation
    - [ ] Sub-task: Create `convex/migrations.ts` with `cleanSlateAndSeed` mutation
    - [ ] Sub-task: Delete all rows from conversations, messages, knowledge, agentConfig
    - [ ] Sub-task: Verify schema deploys cleanly after migration
- [ ] Task: Make agentId required on conversations and knowledge
    - [ ] Sub-task: Change `v.optional(v.id("agents"))` → `v.id("agents")` on both tables
    - [ ] Sub-task: Redeploy schema, verify
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Data Migration'

## Phase 4: Core Org + Agent Backend
- [ ] Task: Create `convex/lib/permissions.ts`
    - [ ] Sub-task: Define `Permission` union type and `ROLE_PERMISSIONS` map
    - [ ] Sub-task: Implement `requireMember`, `requirePermission`, `requireAgentAccess` helpers
    - [ ] Sub-task: Write unit tests for each helper (all 3 roles × key permissions)
- [ ] Task: Create `convex/organizations.ts`
    - [ ] Sub-task: `createOrg(name, slug)` — creates org + inserts caller as owner
    - [ ] Sub-task: `getMyOrgs()` — returns orgs where calling user is a member
    - [ ] Sub-task: `getOrgBySlug(slug)` — public, used by server-side layout
    - [ ] Sub-task: `updateOrg(orgId, name, logoUrl)` — requires org:update
    - [ ] Sub-task: Write tests
- [ ] Task: Create `convex/members.ts`
    - [ ] Sub-task: `getMembers(orgId)` — requires member:read
    - [ ] Sub-task: `inviteMember(orgId, email, role)` — creates invitation, sends email via Resend
    - [ ] Sub-task: `acceptInvitation(token)` — creates membership, marks invitation accepted
    - [ ] Sub-task: `updateMemberRole(orgId, userId, role)` — requires member:update_role, blocks demoting last owner
    - [ ] Sub-task: `removeMember(orgId, userId)` — requires member:remove, blocks removing last owner
    - [ ] Sub-task: Write tests including edge cases (last owner, expired invite)
- [ ] Task: Create `convex/agents.ts`
    - [ ] Sub-task: `createAgent(orgId, name, slug)` — requires agent:create, generates widgetKey
    - [ ] Sub-task: `getAgents(orgId)` — requires agent:read
    - [ ] Sub-task: `getAgentBySlug(orgId, slug)` — requires agent:read
    - [ ] Sub-task: `getAgentByWidgetKey(widgetKey)` — public, no auth
    - [ ] Sub-task: `updateAgent(agentId, fields)` — requires agent:update
    - [ ] Sub-task: `deleteAgent(agentId)` — requires agent:delete
    - [ ] Sub-task: `rotateWidgetKey(agentId)` — requires agent:update, generates new widgetKey
    - [ ] Sub-task: Write tests
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Core Org + Agent Backend'

## Phase 5: Scope Existing Backend to Agents
- [ ] Task: Update `convex/conversations.ts`
    - [ ] Sub-task: `createConversation(widgetKey, visitorId)` — public, resolves widgetKey → agentId, no auth
    - [ ] Sub-task: `getConversations(agentId)` — requires agent:read via requireAgentAccess
    - [ ] Sub-task: `getConversation(id)` — checks agentId ownership
    - [ ] Sub-task: `deleteConversation(id)` — requires conversation:delete
    - [ ] Sub-task: `setHumanMode`, `markConversationOpened` — requires conversation:reply
    - [ ] Sub-task: Write tenant isolation tests (user in org A cannot read org B conversations)
- [ ] Task: Update `convex/messages.ts`
    - [ ] Sub-task: `sendMessage` as visitor — public, validates conversationId exists
    - [ ] Sub-task: `sendMessage` as admin — requires conversation:reply for the conversation's agent
    - [ ] Sub-task: Write tests
- [ ] Task: Update `convex/knowledge.ts`
    - [ ] Sub-task: All queries and mutations use `by_agent` index and require agent access
    - [ ] Sub-task: Write tenant isolation tests
- [ ] Task: Update `convex/ai.ts`
    - [ ] Sub-task: Derive `agentId` from conversation record (no arg needed)
    - [ ] Sub-task: Scope knowledge search to `agentId`
    - [ ] Sub-task: Load agent config (model, temperature, maxTokens, baseInstructions) from `agents` table
    - [ ] Sub-task: Write test for scoped knowledge retrieval
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Backend Scoping'

## Phase 6: Route Restructure
- [ ] Task: Create `(admin)` route group
    - [ ] Sub-task: `src/app/(admin)/layout.tsx` — server component, verify auth via Convex server client, redirect to /login if unauthenticated, redirect to /onboarding if no orgs
    - [ ] Sub-task: `src/app/(admin)/page.tsx` — redirect to first org (useQuery getMyOrgs)
- [ ] Task: Create org-level routes
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/layout.tsx` — load org by slug, provide OrgContext
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/page.tsx` — redirect to first agent
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/settings/page.tsx` — org name/logo edit
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/members/page.tsx` — member list, invite, role management
- [ ] Task: Create agent-level routes
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/[agentSlug]/layout.tsx` — load agent, provide AgentContext
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/[agentSlug]/inbox/page.tsx` — extract from current admin/page.tsx inbox view
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/[agentSlug]/analytics/page.tsx`
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/[agentSlug]/knowledge/page.tsx`
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/[agentSlug]/config/page.tsx`
    - [ ] Sub-task: `src/app/(admin)/[orgSlug]/[agentSlug]/embed/page.tsx` — widgetKey, embed snippets, rotation
- [ ] Task: Update old admin route
    - [ ] Sub-task: `src/app/admin/page.tsx` → redirect to `/(admin)`
- [ ] Task: Create WorkspaceContext + AgentContext providers
    - [ ] Sub-task: `src/contexts/WorkspaceContext.tsx`
    - [ ] Sub-task: Wire contexts in the respective layout files
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Route Restructure'

## Phase 7: Sidebar + Navigation Overhaul
- [ ] Task: Rewrite admin-sidebar.tsx
    - [ ] Sub-task: Replace hardcoded `data` with `useWorkspace()` hook
    - [ ] Sub-task: Replace `onClick(setView)` nav items with `<Link href>` pointing to route segments
    - [ ] Sub-task: Active state via `usePathname()` instead of `view === "..."` comparison
    - [ ] Sub-task: Org switcher dropdown — navigates to `/{org.slug}/{firstAgent.slug}/inbox`
    - [ ] Sub-task: Agent switcher dropdown — navigates to `/{orgSlug}/{agent.slug}/inbox`
    - [ ] Sub-task: User footer — real email/name, logout button via `useAuthActions().signOut`
    - [ ] Sub-task: Add org settings + member management nav items
- [ ] Task: Delete dead code
    - [ ] Sub-task: Remove `view` state machine from old `components/admin-sidebar.tsx`
    - [ ] Sub-task: Delete old monolithic `AdminPage` component (views now live in route pages)
- [ ] Task: Conductor - User Manual Verification 'Phase 7: Sidebar + Navigation'

## Phase 8: Visitor Widget Scoping
- [ ] Task: Update `ChatWidget` and runtime
    - [ ] Sub-task: `ChatWidget` accepts `widgetKey` prop (required)
    - [ ] Sub-task: `use-chat-runtime.ts` resolves `widgetKey → agentId` via `getAgentByWidgetKey` on mount
    - [ ] Sub-task: Pass `agentId` to `createConversation` (replaces old bare `visitorId` call)
    - [ ] Sub-task: Persist `widgetKey` in localStorage key so clearing doesn't lose it
- [ ] Task: Create public widget page
    - [ ] Sub-task: `src/app/widget/[widgetKey]/page.tsx` — server component that passes widgetKey to ChatWidget
    - [ ] Sub-task: Handle 404 for unknown widgetKey gracefully
- [ ] Task: Update widget.js embed script
    - [ ] Sub-task: Read `data-widget-key` from script tag
    - [ ] Sub-task: Embed as iframe pointing to `/widget/{widgetKey}`
- [ ] Task: Update public demo pages
    - [ ] Sub-task: `src/app/page.tsx` and `src/app/chat/page.tsx` — pass a demo widgetKey or show setup instructions
- [ ] Task: Conductor - User Manual Verification 'Phase 8: Visitor Widget Scoping'

## Phase 9: Onboarding Flow
- [ ] Task: Create onboarding pages
    - [ ] Sub-task: `src/app/(onboarding)/onboarding/create-org/page.tsx` — org name input, slug auto-generated
    - [ ] Sub-task: `src/app/(onboarding)/onboarding/create-agent/page.tsx` — agent name, optional description
    - [ ] Sub-task: `src/app/(onboarding)/onboarding/embed/page.tsx` — show widget snippet, link to `/widget/[widgetKey]` preview
- [ ] Task: Wire onboarding redirect in auth gate
    - [ ] Sub-task: After login, if `getMyOrgs()` returns empty array → redirect to `/onboarding/create-org`
- [ ] Task: Conductor - User Manual Verification 'Phase 9: Onboarding Flow'

## Phase 10: Cleanup
- [ ] Task: Remove agentConfig table
    - [ ] Sub-task: Delete `convex/agentConfig.ts`
    - [ ] Sub-task: Remove `agentConfig` from `convex/schema.ts`
    - [ ] Sub-task: Verify no remaining references in frontend
- [ ] Task: Remove migration helpers
    - [ ] Sub-task: Delete or gate `convex/migrations.ts` behind an env flag
- [ ] Task: Full regression test
    - [ ] Sub-task: Login → onboarding → create org + agent → embed widget → send message → reply from inbox
    - [ ] Sub-task: Invite a second user, verify role permissions work
    - [ ] Sub-task: Verify user in org A cannot access org B data (tenant isolation smoke test)
- [ ] Task: Conductor - User Manual Verification 'Phase 10: Cleanup'
