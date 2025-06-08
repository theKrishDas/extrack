"use client"

import {useEffect} from "react"
import {Form as RacForm} from "react-aria-components"

import {NewTransactionSchemaType} from "@/lib/schema/transactions"
import {Button} from "@/components/ui/button/animated-button"
import {useNewTransaction} from "@/components/form/transaction/new/provider"

import AccountSelect from "./Account"
import AmountInput from "./Amount"
import CategorySelect from "./Category"
import {setLastUsedAccount, setLastUsedCategory} from "./helpers"

const Form = ({afterSubmit}: {afterSubmit?: () => void}) => {
  const {form, transactionType} = useNewTransaction()
  const {handleSubmit, setValue} = form

  useEffect(() => {
    setValue("type", transactionType)
  }, [setValue, transactionType])

  const onSubmit = (data: NewTransactionSchemaType) => {
    console.log(data)
    setLastUsedCategory(transactionType, data.category)
    setLastUsedAccount(data.account)
    afterSubmit?.()
  }

  return (
    <RacForm onSubmit={handleSubmit(onSubmit)}>
      <AmountInput />
      <CategorySelect />
      <AccountSelect />

      <Button className="rounded-2xl" variant="filled" fullWidth type="submit">
        Save
      </Button>
    </RacForm>
  )
}

export default Form
