import {ReactNode} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {
  newTransactionSchema,
  NewTransactionSchemaType,
} from "@/lib/schema/new-transaction-schema"

import {FormContext} from "./context-helpers"

export function Provider({children}: {children: ReactNode}) {
  const form = useForm<NewTransactionSchemaType>({
    defaultValues: {
      amount: undefined,
      note: undefined,
      type: undefined,
    },
    resolver: zodResolver(newTransactionSchema),
  })
  return <FormContext value={{form}}>{children}</FormContext>
}
