import { Icon } from "@iconify/react/dist/iconify.js"
import { useQuery } from "convex-helpers/react/cache/hooks"
import Fuse from "fuse.js"
import { useDeferredValue, useEffect, useState } from "react"
import {
  Input,
  Label,
  NumberField,
  Form as RacForm,
  SearchField,
  Text,
  TextField,
} from "react-aria-components"
import { Controller } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { limit } from "#lib/constants/constraints"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button/animated-button"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import { Emoji } from "@/components/ui/emoji"
import { ListBox } from "@/components/ui/list-box"
import { Skeleton } from "@/components/ui/loading/skeleton"
import { Spacer } from "@/components/ui/spacer"
import { CURRENCY } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

import { useNewTransaction } from "./provider"

export function Form() {
  const {
    transactionType,
    form: { handleSubmit, formState },
    onSubmit,
  } = useNewTransaction()

  return (
    <RacForm onSubmit={handleSubmit((v) => onSubmit(v))}>
      <AmountInput />
      <Spacer className="h-1.5" />

      <NoteInput />
      <Spacer className="h-5" />

      <DetailsDrawer />
      <Spacer className="h-8" />

      <Drawer.Footer>
        <Button
          color={transactionType === "expense" ? "red" : "green"}
          fullWidth
          isDisabled={!formState.isValid}
          type="submit"
          variant="filled"
        >
          Add {transactionType}
        </Button>
      </Drawer.Footer>
    </RacForm>
  )
}

/**
 * Text and number inputs
 */
function AmountInput() {
  const { form } = useNewTransaction()

  return (
    <Controller
      control={form.control}
      name="amount"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <NumberField
          autoFocus
          className="flex h-18.5 w-full flex-col justify-end px-4"
          formatOptions={{
            style: "currency",
            currency: CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }}
          isInvalid={invalid}
          isRequired
          maxValue={limit.amount.transaction.max / 100}
          minValue={limit.amount.transaction.min / 100}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          validationBehavior="aria"
          value={value}
        >
          {({ state: { numberValue } }) => (
            <>
              <Label className="sr-only">Amount</Label>
              <Input
                className={cn(
                  "w-full truncate text-center font-medium text-[3.9rem] text-label-primary leading-none",
                  "outline-none data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]",
                  numberValue.toString().length > 6 && "text-[3rem]",
                  numberValue.toString().length > 8 && "text-[2.8rem]"
                )}
                placeholder="₹0"
                ref={ref}
              />
              <Text className="sr-only" slot="description">
                {`Amount must be within ${limit.amount.transaction.min / 100} and ${limit.amount.transaction.max / 100}`}
              </Text>
            </>
          )}
        </NumberField>
      )}
      rules={{ required: "Amount is required." }}
    />
  )
}
function NoteInput() {
  const { form } = useNewTransaction()

  return (
    <Controller
      control={form.control}
      name="note"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <>
          <TextField
            className="mx-auto w-full px-4"
            isInvalid={invalid}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            validationBehavior="aria"
            value={value}
          >
            <Label className="sr-only">Add a note to yourself</Label>
            <Input
              className={cn(
                "w-full truncate text-center text-label-secondary text-xl leading-none tracking-[0.015em] placeholder-label-tertiary",
                "outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]"
              )}
              maxLength={limit.note.transaction.maxLength}
              placeholder="Tap here to add a note"
              ref={ref}
            />
          </TextField>
        </>
      )}
    />
  )
}

/**
 * Details Drawer
 */
function DetailsDrawer() {
  const { transactionType: type, form } = useNewTransaction()
  const availableCategories = useQuery(api.category.listByType, { type })
  const availableAccounts = useQuery(api.account.list)
  const { setValue } = form

  useEffect(() => {
    if (availableCategories) {
      setValue("category", availableCategories[0]._id)
    }
    if (availableAccounts) {
      setValue("account", availableAccounts[0]._id)
    }
  }, [setValue, availableCategories, availableAccounts])

  return (
    <div className="grid place-content-center">
      <div className="relative flex items-center gap-1">
        {[
          {
            symbol: "􀑇",
            content: availableAccounts && (
              <AccountSelectionDrawer accounts={availableAccounts} />
            ),
          },
          {
            symbol: "􀏪",
            content: availableCategories && (
              <CategorySelectionDrawer categories={availableCategories} />
            ),
          },
        ].map((item) => (
          <Drawer.NestedRoot key={item.symbol} showHandle>
            {availableCategories !== undefined ? (
              <Drawer.Trigger
                className={cn(
                  buttonVariants({
                    size: "sm",
                    color: "gray",
                    className: "touch-auto",
                  })
                )}
              >
                {item.symbol}
              </Drawer.Trigger>
            ) : (
              <Skeleton
                className={cn(
                  buttonVariants({
                    size: "sm",
                    color: "gray",
                    className:
                      "pointer-events-none touch-auto bg-fill-tertiary text-label-tertiary",
                  })
                )}
              >
                {item.symbol}
              </Skeleton>
            )}

            {item.content}
          </Drawer.NestedRoot>
        ))}

        <Button color="gray" isDisabled size="sm">
          􀉊
        </Button>
      </div>
    </div>
  )
}

function CategorySelectionDrawer({
  categories,
}: {
  categories: Doc<"categories">[]
}) {
  const { form } = useNewTransaction()
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const deferredSearchText = useDeferredValue(searchText)

  const fuse = new Fuse(categories, {
    keys: ["name", "color"],
  })
  const items = deferredSearchText?.length
    ? fuse.search(deferredSearchText).map(({ item }) => item)
    : categories

  return (
    <Drawer.Content className="h-[100%]">
      <Drawer.Header>
        <Drawer.Title className="ml-1">Choose Category</Drawer.Title>
        <Drawer.ClosePrimitive
          className={cn(
            buttonVariants({
              size: "xs",
              variant: "filled",
              isIconOnly: true,
              className: "mr-0.5 font-semibold",
            })
          )}
        >
          􀆅
        </Drawer.ClosePrimitive>
      </Drawer.Header>

      <SearchField
        className="relative px-4 data-[empty]:[&_button]:hidden"
        onChange={setSearchText}
        value={searchText}
      >
        <Label className="sr-only">Search for categories</Label>
        <Input
          className={cn(
            "h-12 w-full rounded-full bg-fill-quaternary pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] placeholder-label-secondary sm:h-10 sm:pr-7.5",
            "outline-none data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          )}
          placeholder="Search..."
        />
        <Button
          className="absolute top-1/2 right-6 -translate-y-1/2 p-0 text-xl"
          color="gray"
          isIconOnly
          size="xs"
          variant="ghost"
        >
          􀁡
        </Button>
      </SearchField>

      <Spacer className="h-4" />

      <Controller
        control={form.control}
        name="category"
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <ListBox.Root
            aria-label="Categories"
            className="overflow-y-auto overflow-x-hidden px-4 pb-12.5"
            disallowEmptySelection
            items={items}
            onBlur={onBlur}
            onSelectionChange={([key]) => {
              onChange(key)
            }}
            ref={ref}
            selectedKeys={[value]}
            selectionMode="single"
            shouldFocusWrap
          >
            {(item) => {
              const { _id, name: itemName, icon, color } = item

              return (
                <ListBox.Item id={_id} key={_id}>
                  <ListBox.Icon
                    className="inline-grid size-8 place-content-center rounded-lg text-sm mix-blend-plus-darker sm:size-7 dark:mix-blend-plus-lighter"
                    style={{
                      color: `var(--ios-${color})`,
                      backgroundColor: `color-mix( in oklab, var(--ios-${color}) 12%, transparent)`,
                    }}
                  >
                    <Icon icon={icon} />
                  </ListBox.Icon>

                  <ListBox.Content>
                    <ListBox.Text level="1">{itemName}</ListBox.Text>
                  </ListBox.Content>
                </ListBox.Item>
              )
            }}
          </ListBox.Root>
        )}
      />
    </Drawer.Content>
  )
}
function AccountSelectionDrawer({ accounts }: { accounts: Doc<"accounts">[] }) {
  const { form } = useNewTransaction()
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const deferredSearchText = useDeferredValue(searchText)

  const fuse = new Fuse(accounts, {
    keys: ["name"],
  })
  const items = deferredSearchText?.length
    ? fuse.search(deferredSearchText).map(({ item }) => item)
    : accounts

  return (
    <Drawer.Content className="h-[100%]">
      <Drawer.Header>
        <Drawer.Title className="ml-1">Choose Account</Drawer.Title>
        <Drawer.ClosePrimitive
          className={cn(
            buttonVariants({
              size: "xs",
              variant: "filled",
              isIconOnly: true,
              className: "mr-0.5 font-semibold",
            })
          )}
        >
          􀆅
        </Drawer.ClosePrimitive>
      </Drawer.Header>

      <SearchField
        className="relative px-4 data-[empty]:[&_button]:hidden"
        onChange={setSearchText}
        value={searchText}
      >
        <Label className="sr-only">Search for accounts</Label>
        <Input
          className={cn(
            "h-12 w-full rounded-full bg-fill-quaternary pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] placeholder-label-secondary sm:h-10 sm:pr-7.5",
            "outline-none data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          )}
          placeholder="Search..."
        />
        <Button
          className="absolute top-1/2 right-6 -translate-y-1/2 p-0 text-xl"
          color="gray"
          isIconOnly
          size="xs"
          variant="ghost"
        >
          􀁡
        </Button>
      </SearchField>

      <Spacer className="h-4" />

      <Controller
        control={form.control}
        name="account"
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <ListBox.Root
            aria-label="Accounts"
            className="overflow-y-auto overflow-x-hidden px-4 pb-12.5"
            disallowEmptySelection
            items={items}
            onBlur={onBlur}
            onSelectionChange={([key]) => {
              onChange(key)
            }}
            ref={ref}
            selectedKeys={[value]}
            selectionMode="single"
            shouldFocusWrap
          >
            {(item) => {
              const { _id, name: itemName, icon, is_active } = item

              return (
                <ListBox.Item id={_id} isDisabled={!is_active} key={_id}>
                  <ListBox.Icon asChild>
                    <Emoji className="text-xl">{icon}</Emoji>
                  </ListBox.Icon>

                  <Spacer className="h-0 w-0" />

                  <ListBox.Content>
                    <ListBox.Text level="1">{itemName}</ListBox.Text>

                    <Spacer className="flex-1" />
                  </ListBox.Content>
                </ListBox.Item>
              )
            }}
          </ListBox.Root>
        )}
      />
    </Drawer.Content>
  )
}
