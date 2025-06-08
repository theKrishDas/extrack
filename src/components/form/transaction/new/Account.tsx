import {useEffect} from "react"
import {createListCollection, Listbox} from "@ark-ui/react/listbox"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useQuery} from "convex/react"
import {Button as RacButton} from "react-aria-components"
import {Controller} from "react-hook-form"

import {
  DrawerContent,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {List} from "@/components/ui/list"
import {Skeleton} from "@/components/ui/loading/skeleton"
import {IonChevronForward} from "@/components/icons/ion"

import {getLastUsedAccount, setLastUsedAccount} from "./helpers"
import {useNewTransaction} from "./provider"

function createCollection(accounts: Doc<"accounts">[]) {
  const mappedAccounts = accounts.map(acc => ({...acc, value: acc._id}))
  return createListCollection({items: mappedAccounts})
}

const AccountSelect = () => {
  const {
    form: {control, setValue},
    transactionType,
  } = useNewTransaction()

  const accounts = useQuery(api.accounts.getAll)
  const accountFromLocalStorage = getLastUsedAccount()

  useEffect(() => {
    if (!accounts?.length) return

    let accountId: string

    if (accountFromLocalStorage) {
      const validAccount = accounts.find(
        acc => acc._id === accountFromLocalStorage.id
      )
      accountId = validAccount ? validAccount._id : accounts[0]._id
    } else {
      accountId = accounts[0]._id
    }

    setLastUsedAccount(accountId)
    setValue("account", accountId)
  }, [accounts, accountFromLocalStorage, transactionType, setValue])

  if (!accounts)
    return (
      <List.Root asChild>
        <div>
          <List.Item asChild>
            <Skeleton />
          </List.Item>
        </div>
      </List.Root>
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
      render={({field: {value, onChange, onBlur, ref}}) => {
        const selectedAccount = collection.find(value)

        return (
          <List.Root>
            <DrawerNested>
              <DrawerTrigger asChild>
                <List.Item asChild>
                  <RacButton className="w-full">
                    <List.Content>
                      <List.Text>Account</List.Text>
                      <div className="inline-flex flex-row-reverse items-center gap-1">
                        <IonChevronForward className="text-label-secondary" />
                        {selectedAccount ? (
                          <List.Text level="1">
                            {selectedAccount.name}
                          </List.Text>
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
                  onSelect={v => {
                    onChange(v.value)
                  }}
                  onBlur={onBlur}
                  ref={ref}
                  collection={collection}
                  value={[value]}
                  loopFocus
                >
                  <Listbox.Label className="sr-only">
                    Select your Account
                  </Listbox.Label>
                  <Listbox.Content asChild>
                    <List.Root className="ring-ios-blue/[var(--separator-non-opaque-opacity)] ring-offset-background rounded-2xl ring-offset-1 outline-none focus-visible:ring-4">
                      {collection.items.map(item => {
                        const {_id: id, name} = item
                        return (
                          <Listbox.Item item={item} key={id} asChild>
                            <List.Item className="data-highlighted:bg-fill-secondary [&:has(+_*[data-highlighted])_.ListContent]:border-transparent data-highlighted:[&>.ListContent]:border-transparent">
                              <List.Content>
                                <Listbox.ItemText asChild>
                                  <List.Text level="1" className="relative">
                                    {name}
                                  </List.Text>
                                </Listbox.ItemText>
                                <Listbox.ItemIndicator className="bg-ios-blue h-3 w-3 rounded-full" />
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
          </List.Root>
        )
      }}
    />
  )
}

export default AccountSelect
