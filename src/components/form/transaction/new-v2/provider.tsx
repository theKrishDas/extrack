"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { createContext, type ReactNode, use } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import type { Id } from "#/convex/_generated/dataModel"

import {
  type NewTransactionSchemaType,
  newTransactionSchema,
  type TTransactionType,
} from "@/lib/schema/transactions"

export type FormContextType = {
  form: UseFormReturn<NewTransactionSchemaType>
  transactionType: TTransactionType
  onSubmit: (data: NewTransactionSchemaType, afterSubmit?: () => void) => void
}
export const FormContext = createContext<FormContextType | null>(null)

/**
 * Form Provider
 */
export function Provider({
  children,
  type,
  afterSubmit,
}: {
  children: ReactNode
  type: TTransactionType
  afterSubmit?: () => void
}) {
  const form = useForm<NewTransactionSchemaType>({
    defaultValues: {
      account: undefined,
      category: undefined,
      amount: undefined,
      note: undefined,
      date: Date.now(),
    },
    resolver: zodResolver(newTransactionSchema),
  })

  const addTransaction = useMutation(api.transaction.create)

  const onSubmit = (data: NewTransactionSchemaType) => {
    const { amount, category, note, account } = data

    addTransaction({
      amount,
      type,
      note,
      account: account as Id<"accounts">,
      category: category as Id<"categories">,
      date: Date.now(),
    })

    form.reset()
    afterSubmit?.()
  }

  return (
    <FormContext
      value={{
        form,
        transactionType: type,
        onSubmit,
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
