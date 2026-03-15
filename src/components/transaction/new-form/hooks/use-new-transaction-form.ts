import { insertAtTop, useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { useQuery } from "convex-helpers/react/cache/hooks"
import { useEffect } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import type z from "zod/v3"
import { api } from "#/convex/_generated/api"
import type { Id } from "#/convex/_generated/dataModel"
import type { TransactionTypes } from "@/lib/constants/transaction-types"
import { type NewTransactionSchemaType, newTransactionSchema } from "../schema"
import { useAppForm } from "./form-context"

export function useNewTransactionForm(
  type: TransactionTypes,
  afterSubmit?: (data: NewTransactionSchemaType) => void
) {
  // Fetches accounts, categories, and user defaults (default account + last-used category)
  // for pre-filling the form selects. This also doubles as our local store source
  // for the optimistic update below — since these are already subscribed, localStore can resolve them.
  const context = useQuery(api.transaction.getCreateContext, { type })

  // Optimistically inserts the new transaction at the top of the paginated list
  // before the server responds, so the UI feels instant.
  //
  // One gotcha with paginated queries: you can't use localStore.setQuery directly.
  // Convex provides dedicated helpers instead:
  //   - insertAtTop / insertAtPosition — for inserting new items
  //   - optimisticallyUpdateValueInPaginatedQuery — for mutating an existing item (needs the item's _id)
  const createTransaction = useMutation(
    api.transaction.create
  ).withOptimisticUpdate((localStore, args) => {
    // Look up the full account/category docs from context — we need the entire Doc shape
    // because listPaginatedDetailed returns enriched transactions (account + category embedded),
    // so the optimistic item has to match that shape exactly.
    const account = context?.accounts.find((acc) => acc._id === args.account)
    const category = context?.categories.find(
      (cat) => cat._id === args.category
    )

    // If context hasn't loaded yet, skip — Convex reactivity will handle it once the mutation settles.
    if (!(account && category)) return

    insertAtTop({
      paginatedQuery: api.transaction.listPaginatedDetailed,
      argsToMatch: {},
      localQueryStore: localStore,
      item: {
        _id: uuidv4() as Id<"transactions">,
        _creationTime: Date.now(),
        ownerId: account.ownerId, // account and category share the same owner, either works here
        amount: args.amount,
        date: args.date,
        type: args.type,
        note: args.note,
        account,
        category,
      },
    })
  })

  // create form
  const form = useAppForm({
    validators: {
      onChange: newTransactionSchema,
    },
    defaultValues: {
      amount: undefined, // defaults to undefined so the form is invalid until the user fills it in
      account: undefined,
      category: undefined,
      date: Date.now(),
      note: undefined,
      type,
    } as unknown as z.input<typeof newTransactionSchema>,
    onSubmit: ({ value: data }) => {
      createTransaction({
        amount: data.amount * 100, // dollars to cents
        category: data.category as Id<"categories">,
        account: data.account as Id<"accounts">,
        date: data.date,
        type: data.type,
        note: data.note,
      }).catch((err) => {
        toast.error("Failed to add transaction", {
          description:
            err instanceof ConvexError ? err.data.message : "Unknown err",
        })
      })

      afterSubmit?.(data)
    },
  })

  // Convex defaults are async — setting them in defaultValues would either
  // initialize with undefined (stale) or block the whole form from rendering (loading).
  // useEffect patches only account/category once loaded, so fields like
  // amount and date are immediately interactive.
  useEffect(() => {
    if (!context) return
    form.setFieldValue("account", context.defaults.account)
    form.setFieldValue("category", context.defaults.category)
  }, [context, form])

  return {
    form,
    context,
  }
}
