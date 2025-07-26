"use client"

import {useEffect, useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {api} from "#/convex/_generated/api"
import {useMutation, useQuery} from "convex/react"
import {Form as RacForm} from "react-aria-components"
import {useForm} from "react-hook-form"

import {newAccountSchema, NewAccountSchemaType} from "@/lib/schema/accounts"
import {Spacer} from "@/components/ui/spacer"
import {Spinner} from "@/components/loading/spinner"

import {EditName} from "./EditName"
import {Header} from "./Header"
import {IconPicker} from "./IconPicker"
import {OtherSettings} from "./OtherSettings"

export default function AccountInfo({id}: {id: string}) {
  const account = useQuery(api.accounts.getByStringId, {id})
  const editable = !!account

  const update = useMutation(api.accounts.update).withOptimisticUpdate(
    (localStore, args) => {
      const {id, ...rest} = args
      const existing = localStore.getQuery(api.accounts.getByStringId, {id})
      if (!!existing) {
        localStore.setQuery(
          api.accounts.getByStringId,
          {id},
          {...existing, ...rest}
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
    formState: {isDirty, defaultValues},
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
    if (!editable || !isEditing || !isDirty || defaultValues === getValues())
      return

    const {name, icon} = data
    update({id: account._id, name, icon})
    setEditing(false)
    form.reset()
  }

  return (
    <RacForm onSubmit={form.handleSubmit(onSubmit)} validationBehavior="aria">
      <Header
        editable={editable}
        isEditing={isEditing}
        setEditing={setEditing}
        form={form}
        onSubmit={onSubmit}
      />

      <Spacer className="h-8" />

      {account === undefined ? (
        <Spinner />
      ) : account === null ? (
        <p>No accounts found!</p>
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          <IconPicker isEditing={isEditing} form={form} account={account} />
          <EditName isEditing={isEditing} form={form} account={account} />
          <OtherSettings isEditing={isEditing} account={account} />
        </div>
      )}
    </RacForm>
  )
}
