/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as account from "../account.js";
import type * as analytics from "../analytics.js";
import type * as category from "../category.js";
import type * as lib_doc from "../lib/doc.js";
import type * as lib_utils from "../lib/utils.js";
import type * as tests_helpers from "../tests/helpers.js";
import type * as transaction from "../transaction.js";
import type * as userOnboarding from "../userOnboarding.js";
import type * as webhook from "../webhook.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  account: typeof account;
  analytics: typeof analytics;
  category: typeof category;
  "lib/doc": typeof lib_doc;
  "lib/utils": typeof lib_utils;
  "tests/helpers": typeof tests_helpers;
  transaction: typeof transaction;
  userOnboarding: typeof userOnboarding;
  webhook: typeof webhook;
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
