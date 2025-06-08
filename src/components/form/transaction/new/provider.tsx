"use client"

import {createContext, ReactNode, use} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm, UseFormReturn} from "react-hook-form"

import {
  newTransactionSchema,
  NewTransactionSchemaType,
  TTransactionType,
} from "@/lib/schema/transactions"

export type FormContextType = {
  form: UseFormReturn<NewTransactionSchemaType>
  transactionType: TTransactionType
}
export const FormContext = createContext<FormContextType | null>(null)

/**
 * Form Provider
 */
export function Provider({
  children,
  transactionType,
}: {
  children: ReactNode
  transactionType: TTransactionType
}) {
  const form = useForm<NewTransactionSchemaType>({
    defaultValues: {
      amount: undefined,
      note: undefined,
      category: undefined,
      account: undefined,
    },
    resolver: zodResolver(newTransactionSchema),
  })

  return (
    <FormContext
      value={{
        form,
        transactionType,
      }}
    >
      {children}
    </FormContext>
  )
}

/**
 * context hook
 */
export const useNewTransaction = () => {
  const context = use(FormContext)
  if (!context)
    throw new Error("useFormContext must be used within the Provider.")

  return context
}
