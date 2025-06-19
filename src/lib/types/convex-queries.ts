import {api} from "#/convex/_generated/api"
import {FunctionReturnType} from "convex/server"

export type TransactionJoined = FunctionReturnType<
  typeof api.transactions.getJoinedPaginated
>["page"][number]

export type TransactionSummaryByTimeFrame = FunctionReturnType<
  typeof api.summary.getTransactionSummaryByTimeframe
>
