import type { FunctionReturnType } from "convex/server"
import type { api } from "#/convex/_generated/api"

export type TransactionJoined = FunctionReturnType<
  typeof api.transactions.getJoinedPaginated
>["page"][number]

export type TransactionSummaryByTimeFrame = FunctionReturnType<
  typeof api.summary.getTransactionSummaryByTimeframe
>

/** The two Convex-reserved field names */
export type ConvexReservedFields = "_id" | "_creationTime"

/**
 * Removes Convex’s internal fields (_id, _creationTime)
 * from a document type, leaving only user-defined props.
 */
export type OmitConvexInternals<T> = Omit<T, ConvexReservedFields>
