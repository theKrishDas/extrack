import { createListCollection, Listbox } from "@ark-ui/react/listbox"
import { useQuery } from "convex-helpers/react/cache/hooks"
import { useEffect } from "react"
import { Button as RacButton } from "react-aria-components"
import { Controller } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { IonChevronForward } from "@/components/icons/ion"
import {
  DrawerContent,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { List } from "@/components/ui/list"
import { Skeleton } from "@/components/ui/loading/skeleton"

import { getLastUsedAccount, setLastUsedAccount } from "./helpers"
import { useNewTransaction } from "./provider"

function createCollection(accounts: Doc<"accounts">[]) {
  const mappedAccounts = accounts.map((acc) => ({ ...acc, value: acc._id }))
  return createListCollection({ items: mappedAccounts })
}

const AccountSelect = () => {
  const {
    form: { control, setValue },
  } = useNewTransaction()
  const accounts = useQuery(api.account.list)
  const accountFromLocalStorage = getLastUsedAccount()

  useEffect(() => {
    if (!accounts?.length) return

    let accountId: string

    if (accountFromLocalStorage) {
      const validAccount = accounts.find(
        (acc) => acc._id === accountFromLocalStorage.id
      )
      accountId = validAccount ? validAccount._id : accounts[0]._id
    } else {
      accountId = accounts[0]._id
    }

    setLastUsedAccount(accountId)
    setValue("account", accountId)
  }, [accounts, accountFromLocalStorage, setValue])

  if (!accounts)
    return (
      <List.Item asChild>
        <Skeleton />
      </List.Item>
    )

  if (accounts.length <= 0) {
    // TODO: Handle this properly
    return <p>No categories found: Add one</p>
  }

  // Creating the collection from the return-type
  const collection = createCollection(accounts)

  return (
    <Controller
      control={control}
      name="account"
      render={({ field: { value, onChange, onBlur, ref } }) => {
        const selectedAccount = collection.find(value)

        return (
          <DrawerNested>
            <DrawerTrigger asChild>
              <List.Item asChild>
                <RacButton className="w-full">
                  <List.Content>
                    <List.Text>Account</List.Text>
                    <div className="inline-flex flex-row-reverse items-center gap-1">
                      <IonChevronForward className="text-label-secondary" />
                      {selectedAccount ? (
                        <List.Text level="1">{selectedAccount.name}</List.Text>
                      ) : (
                        <List.Text level="3">Empty</List.Text>
                      )}
                    </div>
                  </List.Content>
                </RacButton>
              </List.Item>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerTitle className="my-4 text-center">Accounts</DrawerTitle>

              <Listbox.Root
                className="px-4"
                collection={collection}
                loopFocus
                onBlur={onBlur}
                onSelect={(v) => {
                  onChange(v.value)
                }}
                ref={ref}
                value={[value]}
              >
                <Listbox.Label className="sr-only">
                  Select your Account
                </Listbox.Label>
                <Listbox.Content asChild>
                  <List.Root className="rounded-2xl outline-none ring-ios-blue/(--separator-non-opaque-opacity) ring-offset-1 ring-offset-background focus-visible:ring-4">
                    {collection.items.map((item) => {
                      const { _id: id, name } = item
                      return (
                        <Listbox.Item asChild item={item} key={id}>
                          <List.Item className="data-highlighted:bg-fill-secondary [&:has(+_*[data-highlighted])_.ListContent]:border-transparent data-highlighted:[&>.ListContent]:border-transparent">
                            <List.Content>
                              <Listbox.ItemText asChild>
                                <List.Text className="relative" level="1">
                                  {name}
                                </List.Text>
                              </Listbox.ItemText>
                              <Listbox.ItemIndicator className="h-3 w-3 rounded-full bg-ios-blue" />
                            </List.Content>
                          </List.Item>
                        </Listbox.Item>
                      )
                    })}
                  </List.Root>
                </Listbox.Content>
              </Listbox.Root>
            </DrawerContent>
          </DrawerNested>
        )
      }}
    />
  )
}

export default AccountSelect
