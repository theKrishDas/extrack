/** biome-ignore-all lint/correctness/noChildrenProp: TanStack Form docs use children prop pattern */
"use client"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { useState } from "react"
import { Toolbar } from "react-aria-components"
import { api } from "#/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Spacer } from "@/components/ui/spacer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import type { TransactionTypes } from "@/lib/constants/transaction-types"
import { useAppForm } from "./hooks/form-context"
import { type NewTransactionSchemaType, newTransactionSchema } from "./schema"

export function Form() {
  const txnType: TransactionTypes = "expense" // TODO: accept it as a prop from the parent
  const availableCategories = useQuery(api.categories.getByType, {
    type: txnType,
  })
  const [data, setData] = useState<NewTransactionSchemaType | null>(null)
  const formatter = useCurrencyFormatter()
  const form = useAppForm({
    validators: { onChange: newTransactionSchema },
    defaultValues: {
      account: "ACC-01KJES",
      category: "CAT-VM4DCM",
      amount: undefined as never, // amount is undefined so the form is invalid by default
      date: Date.now(), // FIXME: might cause hidration error
      note: undefined,
      type: txnType,
    } as NewTransactionSchemaType,
    onSubmit: ({ value: data }) => {
      setData(data)
    },
  })

  return (
    <>
      <pre className="flex flex-col gap-1 font-mono text-xs leading-snug">
        <code>{JSON.stringify(data, null, 2)}</code>
        <code>
          {format(data?.date || Date.now(), "EE, dd MMM yyyy 'at' hh:mm a")}
        </code>
      </pre>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField
          children={(field) => (
            <field.AmountField
              label="Amount"
              placeholder={formatter.format(0)}
            />
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
              <field.CategoryField categories={availableCategories} />
            )}
            name="category"
          />
          <form.AppField
            children={(field) => <field.DateField />}
            name="date"
          />
        </Toolbar>

        <Button type="submit">Save</Button>
      </form>

      <form.Subscribe selector={(state) => [state.errorMap]}>
        {([errorMap]) => {
          const errors = errorMap.onChange
          if (!errors) return null

          const messages = Object.values(errors)
            .flat()
            .map((e) => e.message)
          return (
            <ul className="align-middle text-ios-red [&>li>span]:first:font-semibold [&>li>span]:first:text-[0.9em] [&>li]:flex [&>li]:items-center [&>li]:gap-1 [&>li]:ps-1">
              {messages.map((m) => (
                <li key={m}>
                  <span aria-hidden={true}>􀆄</span>
                  {m}
                </li>
              ))}
            </ul>
          )
        }}
      </form.Subscribe>
    </>
  )
}
