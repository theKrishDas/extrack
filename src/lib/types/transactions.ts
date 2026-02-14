import type { Doc } from "#/convex/_generated/dataModel"

import type { ConvexReservedFields } from "./convex-queries"

export type Transaction = Doc<"transactions">

export type TransactionInsert = Omit<
  Transaction,
  ConvexReservedFields | "ownerId"
>
