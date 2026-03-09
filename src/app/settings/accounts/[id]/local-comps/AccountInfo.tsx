"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import { Form as RacForm } from "react-aria-components"
import { useForm } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import { Spinner } from "@/components/loading/spinner"
import { Spacer } from "@/components/ui/spacer"
import {
  type NewAccountSchemaType,
  newAccountSchema,
} from "@/lib/schema/accounts"

import { EditName } from "./EditName"
import { Header } from "./Header"
import { IconPicker } from "./IconPicker"
import { OtherSettings } from "./OtherSettings"

export default function AccountInfo({ id }: { id: string }) {
  const account = useQuery(api.account.getByStringId, { id })
  const editable = !!account

  const update = useMutation(api.account.update).withOptimisticUpdate(
    (localStore, args) => {
      const { id, ...rest } = args
      const existing = localStore.getQuery(api.account.getByStringId, { id })
      if (existing) {
        localStore.setQuery(
          api.account.getByStringId,
          { id },
          { ...existing, ...rest }
        )
      }
    }
  )

  const [isEditing, setEditing] = useState(false)

  const form = useForm<NewAccountSchemaType>({
    defaultValues: {
      name: undefined,
      balance: undefined,
      icon: undefined,
    },
    resolver: zodResolver(newAccountSchema),
  })

  const {
    formState: { isDirty, defaultValues },
    getValues,
  } = form

  useEffect(() => {
    if (account)
      form.reset({
        name: account.name,
        balance: account.currentBalance,
        icon: account.icon,
      })
  }, [form, account])

  const onSubmit = (data: NewAccountSchemaType) => {
    if (!(editable && isEditing && isDirty) || defaultValues === getValues())
      return

    const { name, icon } = data
    update({ id: account._id, name, icon })
    setEditing(false)
    form.reset()
  }

  return (
    <RacForm onSubmit={form.handleSubmit(onSubmit)} validationBehavior="aria">
      <Header
        editable={editable}
        form={form}
        isEditing={isEditing}
        onSubmit={onSubmit}
        setEditing={setEditing}
      />

      <Spacer className="h-8" />

      {(() => {
        if (account === undefined) return <Spinner />
        if (account === null) return <p>No accounts found!</p>

        return (
          <div className="flex w-full flex-col items-center justify-center">
            <IconPicker account={account} form={form} isEditing={isEditing} />
            <EditName account={account} form={form} isEditing={isEditing} />
            <OtherSettings account={account} isEditing={isEditing} />
          </div>
        )
      })()}
    </RacForm>
  )
}
