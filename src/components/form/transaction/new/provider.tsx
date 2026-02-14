"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { createContext, type ReactNode, use } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"

import {
  type NewTransactionSchemaType,
  newTransactionSchema,
  type TTransactionType,
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
