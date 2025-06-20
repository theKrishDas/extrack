"use client"

import {useEffect} from "react"
import {api} from "#/convex/_generated/api"
import {Id} from "#/convex/_generated/dataModel"
import {useMutation} from "convex/react"
import {Form as RacForm} from "react-aria-components"

import {NewTransactionSchemaType} from "@/lib/schema/transactions"
import {Button} from "@/components/ui/button/animated-button"
import {List} from "@/components/ui/list"
import {useNewTransaction} from "@/components/form/transaction/new/provider"

import AccountSelect from "./Account"
import AmountInput from "./Amount"
import CategorySelect from "./Category"
import {setLastUsedAccount, setLastUsedCategory} from "./helpers"
import Note from "./Note"

const Form = ({afterSubmit}: {afterSubmit?: () => void}) => {
  const {form, transactionType} = useNewTransaction()
  const {handleSubmit, setValue} = form
  const addTransaction = useMutation(api.transactions.add)

  useEffect(() => {
    setValue("type", transactionType)
  }, [setValue, transactionType])

  const onSubmit = (data: NewTransactionSchemaType) => {
    const {amount, type, category, note, account} = data
    addTransaction({
      amount,
      type,
      note,
      account: account as Id<"accounts">,
      category: category as Id<"categories">,
      date: new Date().getTime(),
    })
    setLastUsedCategory(transactionType, category)
    setLastUsedAccount(account)
    afterSubmit?.()
  }

  return (
    <RacForm onSubmit={handleSubmit(onSubmit)}>
      <AmountInput />

      <List.Root className="mb-4" noSpacing asChild>
        <div>
          <CategorySelect />
          <AccountSelect />
        </div>
      </List.Root>

      <Note />

      <Button className="rounded-2xl" variant="filled" fullWidth type="submit">
        Save
      </Button>
    </RacForm>
  )
}

export default Form
