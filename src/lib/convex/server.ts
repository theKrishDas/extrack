import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import type { Preloaded } from "convex/react"
import type { FunctionReference, OptionalRestArgs } from "convex/server"

/**
 * Retrieves the Clerk auth token formatted for Convex authentication.
 * Returns `undefined` if the user is not authenticated.
 */
export async function getAuthToken() {
  return (await (await auth()).getToken({ template: "convex" })) ?? undefined
}

/**
 * Authenticated wrapper around {@link preloadQuery}.
 *
 * Retrieves the Clerk auth token automatically and executes a Convex query,
 * returning a `Preloaded` payload to pass to {@link usePreloadedQuery} in a
 * Client Component.
 *
 * @param query - A {@link FunctionReference} for the public query to run,
 * like `api.dir1.dir2.filename.func`.
 * @param args - Optional arguments object for the query. Omit or pass `{}`
 * for no-arg queries. The auth token is injected automatically.
 * @returns A promise of the `Preloaded` payload.
 *
 * @example
 * const preloaded = await preloadAuthQuery(api.tasks.get)
 * const preloaded = await preloadAuthQuery(api.tasks.getById, { id: "123" })
 */
export const preloadAuthQuery = async <
  Query extends FunctionReference<"query">,
>(
  query: Query,
  ...rest: OptionalRestArgs<Query>
): Promise<Preloaded<Query>> => {
  const [args] = rest
  const token = await getAuthToken()

  // `args ?? {}` is safe because for no-arg queries `_args` is `{}`
  return await preloadQuery(query, args ?? {}, { token })
}
