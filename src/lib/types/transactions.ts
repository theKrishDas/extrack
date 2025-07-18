import {Doc} from "#/convex/_generated/dataModel"

import {ConvexReservedFields} from "./convex-queries"

export type Transaction = Doc<"transactions">

export type TransactionInsert = Omit<
  Transaction,
  ConvexReservedFields | "ownerId"
>
