"use client"

import { useMutation } from "convex/react"
import { Form as RacForm } from "react-aria-components"
import { api } from "#/convex/_generated/api"
import type { Id } from "#/convex/_generated/dataModel"
import { useNewTransaction } from "@/components/form/transaction/new/provider"
import { Button } from "@/components/ui/button/animated-button"
import { List } from "@/components/ui/list"
import type { NewTransactionSchemaType } from "@/lib/schema/transactions"

import AccountSelect from "./Account"
import AmountInput from "./Amount"
import CategorySelect from "./Category"
import { setLastUsedAccount, setLastUsedCategory } from "./helpers"
import Note from "./Note"

const Form = ({ afterSubmit }: { afterSubmit?: () => void }) => {
  const { form, transactionType } = useNewTransaction()
  const { handleSubmit } = form
  const addTransaction = useMutation(api.transaction.create)

  const onSubmit = (data: NewTransactionSchemaType) => {
    const { amount, category, note, account } = data
    addTransaction({
      amount,
      note,
      type: transactionType,
      account: account as Id<"accounts">,
      category: category as Id<"categories">,
      date: Date.now(),
    })
    setLastUsedCategory(transactionType, category)
    setLastUsedAccount(account)
    afterSubmit?.()
  }

  return (
    <RacForm onSubmit={handleSubmit(onSubmit)}>
      <AmountInput />

      <List.Root asChild className="mb-4" noSpacing>
        <div>
          <CategorySelect />
          <AccountSelect />
        </div>
      </List.Root>

      <Note />

      <Button className="rounded-2xl" fullWidth type="submit" variant="filled">
        Save
      </Button>
    </RacForm>
  )
}

export default Form
