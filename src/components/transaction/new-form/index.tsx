/** biome-ignore-all lint/correctness/noChildrenProp: TanStack Form docs use children prop pattern */
"use client"
import { useQuery } from "convex/react"
import { useEffect } from "react"
import { Toolbar } from "react-aria-components"
import { toast } from "sonner"
import { api } from "#/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Spacer } from "@/components/ui/spacer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import type { TransactionTypes } from "@/lib/constants/transaction-types"
import { useAppForm } from "./hooks/form-context"
import { type NewTransactionSchemaType, newTransactionSchema } from "./schema"

export function Form(props: {
  type: TransactionTypes
  afterSubmit?: (data: NewTransactionSchemaType) => void
}) {
  const { type, afterSubmit } = props
  const defaults = useQuery(api.transactions.getFormDefaults, { type })

  const formatter = useCurrencyFormatter()
  const form = useAppForm({
    validators: {
      onChange: newTransactionSchema,
    },
    defaultValues: {
      // undefined so the schema rejects submission until they are filled in
      account: undefined as never,
      category: undefined as never,
      amount: undefined as never,
      date: Date.now(),
      note: undefined,
      type,
    } as NewTransactionSchemaType,
    onSubmit: ({ value: data }) => {
      toast("Sbmittion data", {
        description: (
          <pre className="corner-squircle w-full max-w-full overflow-x-auto rounded-xl bg-fill-primary p-2 font-mono text-label-primary text-xs">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      afterSubmit?.(data)
    },
  })

  // Convex defaults are async — setting them in defaultValues would either
  // initialize with undefined (stale) or block the whole form from rendering.
  // useEffect patches only account/category once loaded, so fields like
  // amount and date are immediately interactive.
  useEffect(() => {
    if (!defaults) return
    form.setFieldValue("account", defaults.defaults.account)
    form.setFieldValue("category", defaults.defaults.category)
  }, [defaults, form])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.AppField
        children={(field) => (
          <field.AmountField label="Amount" placeholder={formatter.format(0)} />
        )}
        name="amount"
      />
      <Spacer className="h-1.5" />

      <form.AppField
        children={(field) => (
          <field.NoteField label="Note" placeholder="Tap to add a note" />
        )}
        name="note"
      />
      <Spacer className="h-5" />

      {/* Toolbar enables arrow key navigation between buttons */}
      <Toolbar
        aria-label="Transaction options"
        className="flex w-full items-center justify-center gap-1"
      >
        <form.AppField
          children={(field) => (
            <field.CategoryField categories={defaults?.categories} />
          )}
          name="category"
        />
        <form.AppField children={(field) => <field.DateField />} name="date" />
      </Toolbar>

      <SubmitButton />
      <Spacer className="h-4" />
    </form>
  )
}

function SubmitButton() {
  return (
    <div className="absolute inset-x-0 top-0 left-0 flex h-0 flex-row-reverse items-start justify-between overflow-visible *:m-4">
      <Button
        aria-label="Add transaction"
        isIconOnly
        size="sm"
        type="submit"
        variant="filled"
      >
        􀆅
      </Button>
    </div>
  )
}
