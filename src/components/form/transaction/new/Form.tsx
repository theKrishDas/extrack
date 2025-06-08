"use client"

import {useEffect} from "react"
import {Form as RacForm} from "react-aria-components"

import {NewTransactionSchemaType} from "@/lib/schema/transactions"
import {Button} from "@/components/ui/button/animated-button"
import {useNewTransaction} from "@/components/form/transaction/new/provider"

import AmountInput from "./Amount"
import CategorySelect from "./Category"
import {setLastUsedCategory} from "./helpers"

const Form = ({afterSubmit}: {afterSubmit?: () => void}) => {
  const {form, transactionType} = useNewTransaction()
  const {handleSubmit, setValue} = form

  useEffect(() => {
    setValue("type", transactionType)

    // Remove this setValue later
    setValue("account", "Acc")
  }, [setValue, transactionType])

  const onSubmit = (data: NewTransactionSchemaType) => {
    console.log(data)
    setLastUsedCategory(transactionType, data.category)
    afterSubmit?.()
  }

  return (
    <RacForm onSubmit={handleSubmit(onSubmit)}>
      <AmountInput />
      <CategorySelect />

      <Button className="rounded-2xl" variant="filled" fullWidth type="submit">
        Save
      </Button>
    </RacForm>
  )
}

export default Form
