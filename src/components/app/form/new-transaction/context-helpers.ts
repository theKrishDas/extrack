import {createContext, use} from "react"
import {UseFormReturn} from "react-hook-form"

import {NewTransactionSchemaType} from "@/lib/schema/new-transaction-schema"

export type FormContextType = {form: UseFormReturn<NewTransactionSchemaType>}

export const FormContext = createContext<FormContextType | null>(null)

export const useNewTransaction = () => {
  const context = use(FormContext)
  if (!context)
    throw new Error("useFormContext must be used within the Provider.")

  return context
}
