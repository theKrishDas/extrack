import {Doc} from "#/convex/_generated/dataModel"

export type Transaction = Doc<"transactions">
export type Transactions = Doc<"transactions">[]

export type TransactionInsert = Omit<
  Doc<"transactions">,
  "_id" | "_creationTime"
>
