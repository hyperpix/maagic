/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as ai from "../ai.js";
import type * as auth from "../auth.js";
import type * as conversations from "../conversations.js";
import type * as graphToSteps from "../graphToSteps.js";
import type * as integrations from "../integrations.js";
import type * as issues from "../issues.js";
import type * as items from "../items.js";
import type * as knowledge from "../knowledge.js";
import type * as members from "../members.js";
import type * as messages from "../messages.js";
import type * as migrations from "../migrations.js";
import type * as orders from "../orders.js";
import type * as organizations from "../organizations.js";
import type * as users from "../users.js";
import type * as workflowRunner from "../workflowRunner.js";
import type * as workflows from "../workflows.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  ai: typeof ai;
  auth: typeof auth;
  conversations: typeof conversations;
  graphToSteps: typeof graphToSteps;
  integrations: typeof integrations;
  issues: typeof issues;
  items: typeof items;
  knowledge: typeof knowledge;
  members: typeof members;
  messages: typeof messages;
  migrations: typeof migrations;
  orders: typeof orders;
  organizations: typeof organizations;
  users: typeof users;
  workflowRunner: typeof workflowRunner;
  workflows: typeof workflows;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
