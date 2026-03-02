import { paginationOptsValidator } from "convex/server"
import { ConvexError, v } from "convex/values"
import { stream } from "convex-helpers/server/stream"

import { transactionTypes } from "../src/lib/constants/transaction-types"
import { internal } from "./_generated/api"
import { mutation, query } from "./_generated/server"
import schema from "./schema"
import { getCurrentUserOrThrow } from "./utils"

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx)

    return await ctx.db
      .query("transactions")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .order("asc")
      .collect()
  },
})

export const getById = query({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => await ctx.db.get(id),
})

export const add = mutation({
  args: {
    amount: v.number(),
    note: v.optional(v.string()),
    type: v.union(...transactionTypes.map((t) => v.literal(t))),
    category: v.id("categories"),
    account: v.id("accounts"),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx)
    const [account, category] = await Promise.all([
      ctx.db.get(args.account),
      ctx.db.get(args.category),
    ])

    if (!account) {
      throw new Error("Account not found for the given ID.")
    }

    if (!category) {
      throw new Error("Category not found for the given ID.")
    }

    if (args.type !== category.type) {
      throw new Error("Type of the transaction and category doesn't match!")
    }

    await Promise.all([
      ctx.db.insert("transactions", {
        ownerId: user.ownerId,
        account: account._id,
        category: category._id,
        amount: args.amount,
        date: args.date,
        type: args.type,
        note: args.note,
      }),
      ctx.runMutation(internal.accounts.adjustBalance, {
        id: args.account,
        amount: args.amount,
        type: args.type,
      }),
    ])
  },
})

export const remove = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => {
    const transaction = await ctx.db.get(id)
    if (!transaction) {
      throw new Error("Transaction not found for the given ID")
    }

    const account = await ctx.db.get(transaction.account)
    if (!account) {
      throw new Error("Account not found for the given ID")
    }

    const { amount, type } = transaction

    await Promise.all([
      ctx.db.delete(id),
      ctx.runMutation(internal.accounts.adjustBalance, {
        id: account._id,
        amount,
        type: type === "expense" ? "income" : "expense",
      }),
    ])

    return id
  },
})

export const getBetweenTimeframe = query({
  args: { start: v.number(), end: v.number() },
  handler: async (ctx, { start, end }) => {
    const user = await getCurrentUserOrThrow(ctx)
    return await ctx.db
      .query("transactions")
      .withIndex("by_date", (q) =>
        q.eq("ownerId", user.ownerId).gte("date", start).lte("date", end)
      )
      .order("desc")
      .collect()
  },
})

export const getJoinedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getCurrentUserOrThrow(ctx)

    const transactionStream = stream(ctx.db, schema)
      .query("transactions")
      .withIndex("by_date", (q) => q.eq("ownerId", user.ownerId))
      .order("desc")
      .map(async (transaction) => {
        const [category, account] = await Promise.all([
          await ctx.db.get(transaction.category),
          await ctx.db.get(transaction.account),
        ])

        // This check ensures that the return types for `category` and `account`
        // do not include null values.
        // This condition should never be met, as any attempt to retrieve an
        // invalid account or category using `ctx.db.get(id)` would have already
        // resulted in an error from Convex by now.
        if (!(category && account)) {
          throw new Error("Invariant violated: missing related record")
        }

        return { ...transaction, category, account }
      })

    return transactionStream.paginate({
      ...paginationOpts,
      maximumRowsRead: 50,
    })
  },
})

export const getFormDefaults = query({
  args: { type: v.union(...transactionTypes.map((t) => v.literal(t))) },
  handler: async (ctx, { type }) => {
    const user = await getCurrentUserOrThrow(ctx)

    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .collect()

    if (!accounts.length)
      throw new ConvexError({
        message: "No account found",
        code: 404,
        context: {
          userId: user._id,
          ownerId: user.ownerId,
        },
      })

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_type", (q) =>
        q.eq("ownerId", user.ownerId).eq("type", type)
      )
      .collect()

    if (!categories.length)
      throw new ConvexError({
        message: "No category found",
        code: 404,
        context: {
          userId: user._id,
          ownerId: user.ownerId,
          type,
        },
      })

    const latestTxn = await ctx.db
      .query("transactions")
      .withIndex("by_type", (q) =>
        q.eq("ownerId", user.ownerId).eq("type", type)
      )
      .order("desc")
      .first()

    // use the last transaction to get the last category
    // if no transaction exists, use the first category
    const lastUsedCategory = latestTxn?.category ?? categories[0]._id
    const defaultAccount = user.defaultAccount

    return {
      defaults: {
        account: defaultAccount,
        category: lastUsedCategory,
      },
      accounts,
      categories,
    }
  },
})
