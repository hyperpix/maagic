# Architecture Spec: Multi-Tenant Auth + Orgs + Agents

## 1. Strategic Decisions

### What changes
- Everything behind `/admin` becomes org-scoped and auth-gated
- `agentConfig` singleton → `agents` table (many per org)
- `knowledge` and `conversations` scoped to `agentId`
- Routes move from React `useState` view machine → real URL segments
- Auth via `@convex-dev/auth` with Password + Google OAuth providers
- Visitor widget stays fully public, identified by opaque `widgetKey`

### What does NOT change
- Convex as the realtime backend
- shadcn/ui component library
- The visitor-facing chat widget UX
- Realtime message delivery
- AI response pipeline (just adds scoped knowledge retrieval)

### Non-goals for v1
- Per-agent member access control (all org members see all agents)
- Billing / plan limits
- Webhooks / integrations
- File upload attachments
- Semantic search (still keyword-based)
- Audit logs
- API keys

---

## 2. Domain Model

```
User ──< OrganizationMember >── Organization ──< Agent
                                                    │
                                              ┌─────┴──────┐
                                         Conversation    Knowledge
                                              │
                                           Message
```

### Entities

**User** (managed by `@convex-dev/auth`)
- email, name, image
- can belong to many orgs via OrganizationMember

**Organization**
- name, slug (URL-safe, unique), logoUrl
- has many agents, many members
- slug is immutable once set (changing it would break links)

**OrganizationMember**
- join table: User × Organization × Role
- role: `owner` | `admin` | `member`
- one user can belong to multiple orgs
- last owner cannot leave (must transfer first)

**Invitation** (pending org membership)
- email, orgId, role, token (opaque), invitedBy, expiresAt, acceptedAt
- email can be for an existing or future user

**Agent**
- belongs to one org
- has name, slug (per-org unique), widgetKey (global unique, opaque, used in embed code)
- all former `agentConfig` fields live here
- slug is for admin URLs; widgetKey is for public embed (rotatable without breaking routes)

**Conversation**
- belongs to one agent (implies org)
- visitorId is scoped to (widgetKey, visitorId) — same person across two agents is isolated
- humanMode, openedAt, createdAt

**Message**
- belongs to one conversation
- sender: `visitor` | `agent`

**Knowledge**
- belongs to one agent
- dataType: `text` | `sitemap` | `file` | `url`

---

## 3. Permission Architecture

Rather than hardcoded role checks scattered across functions, permissions are defined as strings and roles map to bundles. All checks go through a single helper.

```ts
type Permission =
  | "org:read" | "org:update" | "org:delete"
  | "member:read" | "member:invite" | "member:update_role" | "member:remove"
  | "agent:create" | "agent:read" | "agent:update" | "agent:delete"
  | "knowledge:read" | "knowledge:write" | "knowledge:delete"
  | "conversation:read" | "conversation:reply" | "conversation:delete"
  | "analytics:read"

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner:  [/* all */],
  admin:  [/* all except org:delete */],
  member: ["org:read", "member:read", "agent:read", "knowledge:read", "knowledge:write",
           "conversation:read", "conversation:reply", "analytics:read"],
}
```

**Convex auth helpers in `convex/lib/permissions.ts`:**

```ts
requireMember(ctx, orgId)          // → Member or throws Unauthenticated/NotMember
requirePermission(ctx, orgId, p)   // → Member or throws Forbidden
requireAgentAccess(ctx, agentId, p)// → { member, agent } — resolves orgId from agent
```

Every admin Convex query/mutation calls one of these. Visitor-facing mutations (`createConversation`, `sendMessage` as visitor, `generateAIResponse`) skip auth entirely but require `agentId`/`widgetKey`.

---

## 4. Authentication Flows

### Providers
- **Password** — email + password, with email verification and password reset
- **Google OAuth** — social login (add GitHub later)

### Email service
- Use **Resend** for transactional email (Convex auth has first-class Resend support)
- Emails: verification, password reset, invitation link

### Auth pages (all under `src/app/(auth)/`)
```
/login          ← shadcn login-02 (email/password + Google button)
/signup         ← same component, different flow prop
/forgot         ← password reset request
/reset          ← password reset confirm (with token)
/invite/[token] ← accept org invitation (auto-login if needed)
```

### Auth state machine
```
Request hits (admin) route
  └─ Not authenticated → redirect /login?returnTo=...
  └─ Authenticated, no orgs → redirect /onboarding
  └─ Authenticated, has orgs → proceed to org route
```

### Onboarding flow (new user)
1. User signs up or logs in for the first time
2. No org memberships found → redirect `/onboarding`
3. `/onboarding/create-org` — set org name, generate slug
4. `/onboarding/create-agent` — name first agent, generates widgetKey
5. `/onboarding/embed` — show embed code snippet for the new agent
6. Redirect to `/{orgSlug}/{agentSlug}/inbox`

---

## 5. Route Structure

```
src/app/
├── layout.tsx                                  root layout, ConvexAuthProvider
├── page.tsx                                    public landing page
├── chat/page.tsx                               public widget demo
│
├── widget/
│   └── [widgetKey]/
│       └── page.tsx                            public embeddable widget (no auth)
│
├── (auth)/
│   ├── login/page.tsx                          login-02 form
│   ├── signup/page.tsx                         signup form
│   ├── forgot/page.tsx                         password reset request
│   ├── reset/page.tsx                          password reset confirm
│   └── invite/[token]/page.tsx                 accept invitation
│
├── (onboarding)/
│   └── onboarding/
│       ├── layout.tsx
│       ├── create-org/page.tsx
│       ├── create-agent/page.tsx
│       └── embed/page.tsx
│
└── (admin)/
    ├── layout.tsx                              auth guard, org context
    ├── page.tsx                                redirect to first org
    └── [orgSlug]/
        ├── layout.tsx                          load org, provide OrgContext
        ├── page.tsx                            redirect to first agent
        ├── settings/page.tsx                   org name, logo
        ├── members/page.tsx                    member list, invite, roles
        └── [agentSlug]/
            ├── layout.tsx                      load agent, provide AgentContext
            ├── page.tsx                        redirect to inbox
            ├── inbox/page.tsx
            ├── analytics/page.tsx
            ├── knowledge/page.tsx
            ├── config/page.tsx                 (was "agent" view)
            └── embed/page.tsx                  embed code + widgetKey rotation
```

**Why `/widget/[widgetKey]` not `/widget/[agentSlug]`:**
The widgetKey is opaque and rotatable. The agentSlug is human-readable and used in admin URLs. They serve different purposes. Website owners embed using widgetKey so they can rotate it without their IT team changing DNS/CSP.

**Old routes:**
- `/admin` → `src/app/admin/page.tsx` redirects to `/(admin)/page.tsx` (first org)
- Current `/` and `/chat` stay untouched during migration

---

## 6. Complete Schema

```ts
import { authTables } from "@convex-dev/auth/server"

export default defineSchema({
  ...authTables,

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    logoUrl: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.id("users"),
  }).index("by_slug", ["slug"]),

  organizationMembers: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_user_and_org", ["userId", "orgId"]),

  invitations: defineTable({
    email: v.string(),
    orgId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
    token: v.string(),
    invitedBy: v.id("users"),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_org", ["orgId"])
    .index("by_email", ["email"]),

  agents: defineTable({
    orgId: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    widgetKey: v.string(),            // opaque, used in embed URLs, rotatable
    createdAt: v.number(),
    // former agentConfig fields:
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    headerImage: v.optional(v.string()),
    backgroundImage: v.optional(v.string()),
    font: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    enableTabs: v.optional(v.boolean()),
    privacyDisclaimer: v.optional(v.string()),
    legalLinks: v.optional(v.array(v.object({ label: v.string(), url: v.string() }))),
    greetingMessage: v.optional(v.string()),
    baseInstructions: v.optional(v.string()),
    model: v.optional(v.string()),
    temperature: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .index("by_slug", ["orgId", "slug"])   // slug unique per org
    .index("by_widget_key", ["widgetKey"]),

  conversations: defineTable({
    agentId: v.id("agents"),
    visitorId: v.string(),
    createdAt: v.number(),
    openedAt: v.optional(v.number()),
    humanMode: v.optional(v.boolean()),
  }).index("by_agent", ["agentId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    sender: v.union(v.literal("visitor"), v.literal("agent")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  knowledge: defineTable({
    agentId: v.id("agents"),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    dataType: v.union(v.literal("text"), v.literal("sitemap"), v.literal("file"), v.literal("url")),
    createdAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_created", ["createdAt"]),
})
```

**Removed:** `agentConfig` table (merged into `agents`).

---

## 7. Convex Backend File Structure

```
convex/
├── auth.ts                   @convex-dev/auth config (Password + Google)
├── http.ts                   auth HTTP routes (required by convex-auth)
├── schema.ts                 full schema above
├── lib/
│   └── permissions.ts        requireMember, requirePermission, requireAgentAccess
├── organizations.ts          createOrg, getMyOrgs, getOrgBySlug, updateOrg, deleteOrg
├── members.ts                inviteMember, acceptInvitation, updateRole, removeMember, getMembers
├── agents.ts                 createAgent, getAgents, getAgentBySlug, getAgentByWidgetKey,
│                             updateAgent, deleteAgent, rotateWidgetKey
├── conversations.ts          (updated) all queries use by_agent index + requireAgentAccess
├── messages.ts               (unchanged internally, auth check on admin send)
├── knowledge.ts              (updated) all queries use by_agent index + requireAgentAccess
├── ai.ts                     (updated) derives agentId from conversation, scoped KB search
└── _generated/               (convex generated)
```

---

## 8. Frontend Architecture

### Contexts

```
WorkspaceContext
  ├── currentUser: User
  ├── orgs: Organization[]
  ├── activeOrg: Organization
  └── activeAgent: Agent

// Resolved server-side in (admin)/[orgSlug]/[agentSlug]/layout.tsx
// Passed to client via context provider
```

### Key hooks

```ts
useWorkspace()              // reads WorkspaceContext
useOrgMembers()             // query for current org's members
useConversations()          // query scoped to activeAgent._id
useKnowledge()              // query scoped to activeAgent._id
```

### Sidebar changes

`admin-sidebar.tsx` gets a complete overhaul:
- Hardcoded `data` constant → replaced by `useWorkspace()` + `useQuery(api.agents.getAgents)`
- Nav items: `onClick(setView)` → `<Link href={...}>` pointing to route segments
- Active state: `usePathname()` from next/navigation instead of `view === "..."` comparisons
- Org switcher: dropdown with `orgs` from context, navigates to `/{org.slug}`
- Agent switcher: dropdown with agents in active org, navigates to `/{orgSlug}/{agent.slug}`
- User footer: real name/email from `currentUser`, logout via `useAuthActions().signOut`

### Admin page decomposition

`src/components/admin-sidebar.tsx` is the one file that holds the entire admin state machine.
After migration, each view becomes its own page component under the route. The big `AdminPage` component with the `view` switch is deleted entirely.

### Visitor widget changes

`ChatWidget` gains a required `widgetKey` prop:
```tsx
<ChatWidget widgetKey="wk_xxxx" />
```

`use-chat-runtime.ts` resolves the widgetKey → agentId via a public Convex query at startup, then passes `agentId` to `createConversation`.

`widget.js` (the embed script) reads `data-widget-key` from the `<script>` tag and passes it to the embedded iframe at `/widget/[widgetKey]`.

---

## 9. Migration Strategy

### Option A: Seed & Migrate (recommended)
1. Deploy new schema with all fields optional initially
2. Run seed mutation: create default org + agent, copy agentConfig fields into agent
3. Patch all existing conversations/knowledge rows with the default agentId
4. Make agentId required, redeploy schema
5. First user who logs in becomes owner of the default org (via onboarding flow check)

### Option B: Clean Slate
Delete all existing data (conversations, messages, knowledge, agentConfig). Simpler to implement; acceptable since this is dev/MVP data.

**Recommendation:** Option B for speed. Add a note in `plan.md`.

---

## 10. Testing Requirements

### Unit tests
- Permission helper: each role has exactly the right permissions, no leakage
- Slug validation: reserved words, uniqueness checks, character constraints

### Integration tests (Convex)
- Tenant isolation: user in org A cannot read org B conversations even if they know the IDs
- Agent isolation: user with access to agent X cannot read agent Y's knowledge
- Role enforcement: member cannot perform admin-only mutations
- Public endpoints: createConversation accepts no auth but requires valid widgetKey

### Auth tests
- Login, signup, password reset flows
- Invitation: create, accept, expire, revoke
- Last owner cannot leave org

### Migration test
- Seed script idempotent (safe to run twice)

---

## 11. Open Decisions

| Decision | Recommendation | Alternative |
|----------|---------------|-------------|
| Clean slate vs migrate existing data | Clean slate (it's dev data) | Seed migration |
| Email provider | Resend | SendGrid |
| OAuth provider(s) for v1 | Google only | + GitHub |
| Org slug: mutable or immutable? | Immutable after creation | Allow with redirect |
| Agent slug: per-org unique or global? | Per-org | Global |
| Multi-org support from day 1? | Yes (architectured for it, switch UI later) | Single org only |
| Domain whitelist for widget embed? | Not in v1, note as future | Implement in v1 |
