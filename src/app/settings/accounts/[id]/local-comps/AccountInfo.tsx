"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { useQuery } from "convex-helpers/react/cache/hooks"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Form as RacForm } from "react-aria-components"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { api } from "#/convex/_generated/api"
import { accountSchema, type UpdateAccountSchemaType } from "#lib/schema"
import { Spinner } from "@/components/loading/spinner"
import { Spacer } from "@/components/ui/spacer"
import { EditName } from "./EditName"
import { Header } from "./Header"
import { IconPicker } from "./IconPicker"
import { OtherSettings } from "./OtherSettings"

export default function AccountInfo() {
  const { id } = useParams<{ id: string }>()
  const account = useQuery(api.account.getByStringId, id ? { id } : "skip")
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

  // initialize form with default values
  const form = useForm<UpdateAccountSchemaType>({
    defaultValues: { name: undefined, icon: undefined },
    resolver: zodResolver(accountSchema.update),
  })

  // populate form with account data
  useEffect(() => {
    if (!account) return
    form.reset({ name: account.name, icon: account.icon })
  }, [form, account])

  const {
    formState: { isDirty, defaultValues },
    getValues,
  } = form

  const onSubmit = (data: UpdateAccountSchemaType) => {
    if (!(editable && isEditing && isDirty) || defaultValues === getValues())
      return

    const { name, icon } = data
    update({ id: account._id, name, icon }).catch((err) => {
      toast.error("Failed to update account", {
        description:
          err instanceof ConvexError ? err.data.message : "Unknown err",
      })
    })
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
