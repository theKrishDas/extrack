/** biome-ignore-all lint/correctness/noChildrenProp: TanStack Form docs use children prop pattern */
"use client"
import { Toolbar } from "react-aria-components"
import type { TransactionTypes } from "#lib/constants/transaction-types"
import { Button } from "@/components/ui/button"
import { Spacer } from "@/components/ui/spacer"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { useNewTransactionForm } from "./hooks/use-new-transaction-form"
import type { NewTransactionSchemaType } from "./schema"

export function Form(props: {
  type: TransactionTypes
  afterSubmit?: (data: NewTransactionSchemaType) => void
}) {
  const formatter = useCurrencyFormatter()
  const { form, context } = useNewTransactionForm(props.type, props.afterSubmit)
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
            <field.AccountField accounts={context?.accounts} />
          )}
          name="account"
        />
        <form.AppField
          children={(field) => (
            <field.CategoryField categories={context?.categories} />
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
        <span aria-hidden={true}>􀆅</span>
      </Button>
    </div>
  )
}
