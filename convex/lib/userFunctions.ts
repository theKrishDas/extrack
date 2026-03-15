import type { GenericMutationCtx, GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions"
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod3"
import type { DataModel, Doc } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"
import { mutation, query } from "../functions"

const getUserOrThrow = async (
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"user">> => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity)
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "Authentication required.",
    })

  const user = await ctx.db
    .query("user")
    .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
    .unique()

  if (!user)
    throw new ConvexError({
      code: "USER_NOT_STORED",
      message: "User not found.",
    })

  return user
}

const userContext = customCtx(
  async (ctx: GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>) => {
    const user = await getUserOrThrow(ctx)
    return { user }
  }
)

export const userQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const user = await getUserOrThrow(ctx)
    return { ctx: { user }, args }
  },
})

export const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await getUserOrThrow(ctx)
    return { ctx: { user }, args }
  },
})

export const zUserQuery = zCustomQuery(query, userContext)
export const zUserMutation = zCustomMutation(mutation, userContext)
