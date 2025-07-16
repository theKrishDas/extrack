import {Fragment, useDeferredValue, useEffect, useState} from "react"
import {Icon} from "@iconify/react/dist/iconify.js"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useQuery} from "convex/react"
import Fuse from "fuse.js"
import {
  Input,
  Label,
  NumberField,
  Form as RacForm,
  SearchField,
  Text,
  TextField,
} from "react-aria-components"
import {Controller} from "react-hook-form"

import {
  MAX_NOTE_LENGTH,
  MAXIMUM_TRANSACTION_AMOUNT,
  MINIMUM_TRANSACTION_AMOUNT,
} from "@/lib/constants/defaults"
import {CURRENCY} from "@/lib/date-utils"
import {cn} from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {ListBox} from "@/components/ui/list-box"
import {Skeleton} from "@/components/ui/loading/skeleton"
import {Spacer} from "@/components/ui/spacer"

import {useNewTransaction} from "./provider"

export function Form() {
  const {
    transactionType,
    form: {handleSubmit, formState},
    onSubmit,
  } = useNewTransaction()

  return (
    <RacForm onSubmit={handleSubmit(v => onSubmit(v))}>
      <AmountInput />
      <Spacer className="h-1.5" />

      <NoteInput />
      <Spacer className="h-5" />

      <DetailsDrawer />
      <Spacer className="h-8" />

      <Drawer.Footer>
        <Button
          type="submit"
          variant="filled"
          color={transactionType === "expense" ? "red" : "green"}
          fullWidth
          isDisabled={!formState.isValid}
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
  const {form} = useNewTransaction()

  return (
    <Controller
      control={form.control}
      name="amount"
      rules={{required: "Amount is required."}}
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <NumberField
          className="flex h-18.5 w-full flex-col justify-end px-4"
          minValue={MINIMUM_TRANSACTION_AMOUNT}
          maxValue={MAXIMUM_TRANSACTION_AMOUNT}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          validationBehavior="aria"
          isRequired
          autoFocus
          isInvalid={invalid}
          formatOptions={{
            style: "currency",
            currency: CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }}
        >
          {({state: {numberValue}}) => (
            <Fragment>
              <Label className="sr-only">Amount</Label>
              <Input
                ref={ref}
                placeholder="₹0"
                className={cn(
                  "text-label-primary w-full truncate text-center text-[3.9rem] leading-none font-medium",
                  "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4",
                  numberValue.toString().length > 6 && "text-[3rem]",
                  numberValue.toString().length > 8 && "text-[2.8rem]"
                )}
              />
              <Text slot="description" className="sr-only">
                {`Amount must be within ${MINIMUM_TRANSACTION_AMOUNT} and ${MAXIMUM_TRANSACTION_AMOUNT}`}
              </Text>
            </Fragment>
          )}
        </NumberField>
      )}
    />
  )
}
function NoteInput() {
  const {form} = useNewTransaction()

  return (
    <Controller
      control={form.control}
      name="note"
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <Fragment>
          <TextField
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            validationBehavior="aria"
            isInvalid={invalid}
            className="mx-auto w-full px-4"
          >
            <Label className="sr-only">Add a note to yourself</Label>
            <Input
              ref={ref}
              maxLength={MAX_NOTE_LENGTH}
              placeholder="Tap here to add a note"
              className={cn(
                "text-label-secondary placeholder-label-tertiary w-full truncate text-center text-xl leading-none tracking-[0.015em]",
                "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4"
              )}
            />
          </TextField>
        </Fragment>
      )}
    />
  )
}

/**
 * Details Drawer
 */
function DetailsDrawer() {
  const {transactionType: type, form} = useNewTransaction()
  const availableCategories = useQuery(api.categories.getByType, {type})
  const availableAccounts = useQuery(api.accounts.getAll)
  const {setValue} = form

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
          {
            symbol: "􀉊",
            content: availableCategories && (
              <CategorySelectionDrawer categories={availableCategories} />
            ),
          },
        ].map((item, idx) => (
          <Drawer.NestedRoot key={idx} showHandle>
            {availableCategories !== undefined ? (
              <Drawer.Trigger
                className={cn(
                  buttonVariants({
                    size: "sm",
                    color: "gray",
                    className: "border-separator-non-opaque touch-auto border",
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
                      "border-separator-non-opaque bg-fill-tertiary text-label-tertiary pointer-events-none touch-auto border",
                  })
                )}
              >
                {item.symbol}
              </Skeleton>
            )}

            {item.content}
          </Drawer.NestedRoot>
        ))}
      </div>
    </div>
  )
}

function CategorySelectionDrawer({
  categories,
}: {
  categories: Doc<"categories">[]
}) {
  const {form} = useNewTransaction()
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const deferredSearchText = useDeferredValue(searchText)

  const fuse = new Fuse(categories, {
    keys: ["name", "color"],
  })
  const items = !deferredSearchText?.length
    ? categories
    : fuse.search(deferredSearchText).map(({item}) => item)

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
        value={searchText}
        onChange={setSearchText}
      >
        <Label className="sr-only">Search for categories</Label>
        <Input
          className={cn(
            "placeholder-label-secondary bg-fill-quaternary h-12 w-full rounded-full pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] sm:h-10 sm:pr-7.5",
            "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:ring-4",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          )}
          placeholder="Search..."
        />
        <Button
          size="xs"
          className="absolute top-1/2 right-6 -translate-y-1/2 p-0 text-xl"
          variant="ghost"
          color="gray"
          isIconOnly
        >
          􀁡
        </Button>
      </SearchField>

      <Spacer className="h-4" />

      <Controller
        control={form.control}
        name="category"
        render={({field: {value, onChange, onBlur, ref}}) => (
          <ListBox.Root
            ref={ref}
            items={items}
            aria-label="Categories"
            selectionMode="single"
            shouldFocusWrap
            disallowEmptySelection
            className="overflow-x-hidden overflow-y-auto px-4 pb-12.5"
            onBlur={onBlur}
            selectedKeys={[value]}
            onSelectionChange={([key]) => {
              onChange(key)
            }}
          >
            {item => {
              const {_id, name: itemName, icon, color} = item

              return (
                <ListBox.Item key={_id} id={_id}>
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
function AccountSelectionDrawer({accounts}: {accounts: Doc<"accounts">[]}) {
  const {form} = useNewTransaction()
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const deferredSearchText = useDeferredValue(searchText)

  const fuse = new Fuse(accounts, {
    keys: ["name"],
  })
  const items = !deferredSearchText?.length
    ? accounts
    : fuse.search(deferredSearchText).map(({item}) => item)

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
        value={searchText}
        onChange={setSearchText}
      >
        <Label className="sr-only">Search for accounts</Label>
        <Input
          className={cn(
            "placeholder-label-secondary bg-fill-quaternary h-12 w-full rounded-full pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] sm:h-10 sm:pr-7.5",
            "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:ring-4",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          )}
          placeholder="Search..."
        />
        <Button
          size="xs"
          className="absolute top-1/2 right-6 -translate-y-1/2 p-0 text-xl"
          variant="ghost"
          color="gray"
          isIconOnly
        >
          􀁡
        </Button>
      </SearchField>

      <Spacer className="h-4" />

      <Controller
        control={form.control}
        name="account"
        render={({field: {value, onChange, onBlur, ref}}) => (
          <ListBox.Root
            ref={ref}
            items={items}
            selectedKeys={[value]}
            aria-label="Accounts"
            selectionMode="single"
            shouldFocusWrap
            disallowEmptySelection
            className="overflow-x-hidden overflow-y-auto px-4 pb-12.5"
            onBlur={onBlur}
            onSelectionChange={([key]) => {
              onChange(key)
            }}
          >
            {item => {
              const {_id, name: itemName, icon, is_active} = item

              return (
                <ListBox.Item key={_id} id={_id} isDisabled={!is_active}>
                  <ListBox.Icon asChild>
                    <Icon icon={icon} />
                  </ListBox.Icon>

                  <Spacer className="h-0 w-0" />

                  <ListBox.Content>
                    <ListBox.Text level="1">{itemName}</ListBox.Text>

                    {/* TODO: Use chips component here */}
                    {item.is_default && (
                      <div className="bg-fill-tertiary text-label-secondary rounded-lg px-1.5">
                        Default
                      </div>
                    )}

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
