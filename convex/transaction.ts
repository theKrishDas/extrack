import { paginationOptsValidator } from "convex/server"
import { ConvexError, v } from "convex/values"
import { stream } from "convex-helpers/server/stream"
import { transactionTypes } from "#lib/constants/transaction-types"
import { internal } from "./_generated/api"
import { mutation, query } from "./_generated/server"
import { getDoc } from "./lib/doc"
import { getCurrentUserOrThrow } from "./lib/utils"
import schema from "./schema"

export const list = query({
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx)

    return await ctx.db
      .query("transactions")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .order("asc")
      .collect()
  },
})

export const get = query({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => await ctx.db.get(id),
})

export const create = mutation({
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
      getDoc(ctx.db, args.account).mustBeOwnedBy(user.ownerId),
      getDoc(ctx.db, args.category).mustBeOwnedBy(user.ownerId),
    ])

    if (args.type !== category.type) {
      throw new ConvexError({
        code: "TRANSACTION_CATEGORY_TYPE_MISMATCH",
        message:
          "The transaction type and category type don't match. Please select a category that matches the transaction type.",
      })
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
      ctx.runMutation(internal.account.applyTransactionFlow, {
        id: args.account,
        amount: args.amount,
        type: args.type,
      }),
    ])
  },
})

const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => {
    const user = await getCurrentUserOrThrow(ctx)
    const transaction = await getDoc(ctx.db, id).mustBeOwnedBy(user.ownerId)
    const account = await getDoc(ctx.db, transaction.account).mustBeOwnedBy(
      user.ownerId
    )

    const { amount, type } = transaction

    await Promise.all([
      ctx.db.delete("transactions", id),
      ctx.runMutation(internal.account.applyTransactionFlow, {
        id: account._id,
        amount,
        type: type === "expense" ? "income" : "expense",
      }),
    ])

    return id
  },
})

export const listByTimeframe = query({
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

export const listPaginatedDetailed = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getCurrentUserOrThrow(ctx)

    const transactionStream = stream(ctx.db, schema)
      .query("transactions")
      .withIndex("by_date", (q) => q.eq("ownerId", user.ownerId))
      .order("desc")
      .map(async (transaction) => {
        const [category, account] = await Promise.all([
          getDoc(ctx.db, transaction.category).mustExist(),
          getDoc(ctx.db, transaction.account).mustExist(),
        ])

        return { ...transaction, category, account }
      })

    return transactionStream.paginate({
      ...paginationOpts,
      maximumRowsRead: 50,
    })
  },
})

export const getCreateContext = query({
  args: { type: v.union(...transactionTypes.map((t) => v.literal(t))) },
  handler: async (ctx, { type }) => {
    const user = await getCurrentUserOrThrow(ctx)

    const accounts = await ctx.db
      .query("accounts")
      .withIndex("by_owner", (q) => q.eq("ownerId", user.ownerId))
      .collect()

    if (!accounts.length) {
      console.error(
        JSON.stringify({
          severity: "CRITICAL",
          invariant: "USER_HAS_NO_ACCOUNTS",
          userId: user._id,
          ownerId: user.ownerId,
          message:
            "Invariant violated: user has zero accounts, expected at least 1",
        })
      )
      throw new Error("Internal invariant violated: user has no accounts")
    }

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_type_name", (q) =>
        q.eq("ownerId", user.ownerId).eq("type", type)
      )
      .collect()

    if (!categories.length) {
      console.error(
        JSON.stringify({
          severity: "CRITICAL",
          invariant: "USER_HAS_NO_CATEGORIES_FOR_TYPE",
          userId: user._id,
          ownerId: user.ownerId,
          type,
          message:
            "Invariant violated: user has zero categories for transaction type, expected at least 1",
        })
      )
      throw new Error(
        "Internal invariant violated: user has no categories for this type"
      )
    }

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

// DX alias so clients can call `api.transaction.delete(...)`
export { deleteTransaction as delete }
