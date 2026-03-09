import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { EmojiPicker } from "frimousse"
import { type CSSProperties, useState } from "react"
import {
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Form as RacForm,
  TextField,
} from "react-aria-components"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { Spinner } from "@/components/loading/spinner"
import { Button } from "@/components/ui/button/animated-button"
import { ActionDrawer, DrawerV2 as Drawer } from "@/components/ui/drawer"
import { Emoji } from "@/components/ui/emoji"
import { List } from "@/components/ui/list-v2"
import { Spacer } from "@/components/ui/spacer"
import { colors } from "@/lib/constants/colors"
import {
  MAX_CATEGORY_NAME_LENGTH,
  MIN_CATEGORY_NAME_LENGTH,
} from "@/lib/constants/defaults"
import {
  type NewCategorySchemaType,
  newCategorySchema,
} from "@/lib/schema/categories"
import { cn, sanitizeName } from "@/lib/utils"

export function Categories() {
  const categories = useQuery(api.category.list)

  if (!categories) return <Spinner />

  const incomeCategories = categories.filter((_) => _.type === "income")
  const expenseCategories = categories.filter((_) => _.type === "expense")

  return (
    <List.Root>
      <List.Header className="relative flex items-center">
        <List.Text level="heading">Expense</List.Text>
        <Button
          className="absolute right-4.5"
          isDisabled
          isIconOnly
          size="xs"
          variant="ghost"
        >
          􀅼
        </Button>
      </List.Header>
      <List.Wrapper>
        {expenseCategories.map((cat) => (
          <Item category={cat} key={cat._id} />
        ))}
      </List.Wrapper>

      <List.Header className="relative flex items-center">
        <List.Text level="heading">Income</List.Text>
        <Button
          className="absolute right-4.5"
          isDisabled
          isIconOnly
          size="xs"
          variant="ghost"
        >
          􀅼
        </Button>
      </List.Header>
      <List.Wrapper>
        {incomeCategories.map((cat) => (
          <Item category={cat} key={cat._id} />
        ))}
      </List.Wrapper>
    </List.Root>
  )
}

function Item({ category }: { category: Doc<"categories"> }) {
  return (
    <List.Item key={category._id}>
      <List.Image>
        <Emoji className="text-xl">{category.icon}</Emoji>
      </List.Image>
      <List.Content>
        <List.Trailing>
          <List.Title>
            <List.Text>{category.name}</List.Text>
          </List.Title>
          <List.Accessories>
            <CategoryActions category={category} />
          </List.Accessories>
        </List.Trailing>
      </List.Content>
    </List.Item>
  )
}

function CategoryActions({ category }: { category: Doc<"categories"> }) {
  const [open, setOpen] = useState(false)
  const deleteCategory = useMutation(api.category.delete)
  const handleDelete = () => {
    deleteCategory({ id: category._id })
    setOpen(false)
  }

  return (
    <ActionDrawer.Root onOpenChange={setOpen} open={open}>
      <Button
        className="touch-auto"
        color="gray"
        isIconOnly
        onPress={() => setOpen(true)}
        size="sm"
        variant="ghost"
      >
        􀍠
      </Button>
      <ActionDrawer.Content>
        <ActionDrawer.Header>
          <ActionDrawer.Title>Actions</ActionDrawer.Title>
        </ActionDrawer.Header>

        <ActionDrawer.Footer>
          <EditCategory afterEdit={() => setOpen(false)} category={category} />
          <DeleteCategory category={category} onDelete={handleDelete} />
        </ActionDrawer.Footer>
      </ActionDrawer.Content>
    </ActionDrawer.Root>
  )
}

function EditCategory({
  category,
  afterEdit,
}: {
  category: Doc<"categories">
  afterEdit?: () => void
}) {
  const update = useMutation(api.category.update)
  const form = useForm<NewCategorySchemaType>({
    defaultValues: {
      type: category.type,
      name: category.name,
      color: category.color,
      icon: category.icon,
    },
    resolver: zodResolver(newCategorySchema),
  })
  const {
    formState: { isDirty, defaultValues },
    getValues,
  } = form

  const editable = isDirty && defaultValues !== getValues()

  const onSubmit = (data: NewCategorySchemaType) => {
    if (!editable) return

    const { name, icon, color } = data
    update({ id: category._id, name, icon, color })

    afterEdit?.()
  }

  return (
    <Drawer.NestedRoot shouldScaleBackground={false}>
      <Drawer.Trigger asChild>
        <ActionDrawer.Action>Edit</ActionDrawer.Action>
      </Drawer.Trigger>

      <Drawer.Content className="h-full">
        <Drawer.Header>
          <Drawer.Title srOnly>Edit {category.name}</Drawer.Title>
          <Drawer.Close />
        </Drawer.Header>

        <RacForm className="px-4" onSubmit={form.handleSubmit(onSubmit)}>
          <EmojiSelect form={form} />
          <Spacer className="h-4" />

          <SelectColor form={form} />
          <Spacer className="h-4" />

          <NameInput form={form} />
          <Spacer className="h-4" />

          <Drawer.ClosePrimitive asChild>
            <Button
              fullWidth
              isDisabled={!editable}
              type="submit"
              variant="filled"
            >
              Done
            </Button>
          </Drawer.ClosePrimitive>
        </RacForm>
        <Spacer className="h-4" />
      </Drawer.Content>
    </Drawer.NestedRoot>
  )
}

function DeleteCategory({
  category,
  onDelete,
}: {
  category: Doc<"categories">
  onDelete: () => void
}) {
  return (
    <>
      <ActionDrawer.Root>
        <ActionDrawer.Trigger asChild>
          <ActionDrawer.Action color="red" isDisabled={category.is_vendor}>
            Delete
          </ActionDrawer.Action>
        </ActionDrawer.Trigger>
        <ActionDrawer.Content>
          <ActionDrawer.Header>
            <ActionDrawer.Title>Delete {category.name}?</ActionDrawer.Title>

            <ActionDrawer.Description>
              You are about to delete this category. All your transactions with
              this category will be deleted aswell!
            </ActionDrawer.Description>
          </ActionDrawer.Header>

          <ActionDrawer.Footer>
            <ActionDrawer.ClosePrimitive asChild>
              <ActionDrawer.Action>Cancel</ActionDrawer.Action>
            </ActionDrawer.ClosePrimitive>

            <ActionDrawer.ClosePrimitive asChild>
              <ActionDrawer.Action
                color="red"
                onPress={onDelete}
                variant="filled"
              >
                Confirm Delete
              </ActionDrawer.Action>
            </ActionDrawer.ClosePrimitive>
          </ActionDrawer.Footer>
        </ActionDrawer.Content>
      </ActionDrawer.Root>

      {category.is_vendor && (
        <List.Text className="text-center" level="footer">
          This is a pre-shipped category and can’t be deleted.
        </List.Text>
      )}
    </>
  )

  // TODO: remove this unused code
  // return (
  //   <Drawer.NestedRoot shouldScaleBackground={false}>
  //     <Drawer.Trigger asChild>
  //       <ActionDrawer.Action
  //         color="red"
  //         isDisabled={category.is_vendor}
  //         variant="tinted"
  //       >
  //         Delete
  //       </ActionDrawer.Action>
  //     </Drawer.Trigger>
  //
  //     {category.is_vendor && (
  //       <List.Text className="text-center" level="footer">
  //         This is a pre-shipped category and can’t be deleted.
  //       </List.Text>
  //     )}
  //
  //     <Drawer.Content>
  //       <Drawer.Header>
  //         <Drawer.Title>Delete {category.name}?</Drawer.Title>
  //       </Drawer.Header>
  //       <div className="flex flex-col gap-2 px-4">
  //         <p>
  //           You are about to delete this category. All your transactions with
  //           this category will be deleted aswell!
  //         </p>
  //
  //         <Drawer.ClosePrimitive asChild>
  //           <Button color="gray" fullWidth>
  //             Cancel
  //           </Button>
  //         </Drawer.ClosePrimitive>
  //
  //         <Drawer.ClosePrimitive asChild>
  //           <Button color="red" fullWidth onPress={onDelete}>
  //             Delete
  //           </Button>
  //         </Drawer.ClosePrimitive>
  //       </div>
  //       <Spacer className="h-4" />
  //     </Drawer.Content>
  //   </Drawer.NestedRoot>
  // )
}

function SelectColor({ form }: { form: UseFormReturn<NewCategorySchemaType> }) {
  return (
    <Controller
      control={form.control}
      name="color"
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <ListBox
          aria-label="colors"
          className="flex w-full items-center justify-center gap-0.5 px-0.5 sm:gap-2"
          disallowEmptySelection
          items={colors.map((color) => ({ color }))}
          onBlur={onBlur}
          onSelectionChange={([key]) => onChange(key)}
          orientation="horizontal"
          ref={ref}
          selectedKeys={[value]}
          selectionMode="single"
          shouldFocusWrap
        >
          {({ color }) => (
            <ListBoxItem
              className={cn(
                "relative h-10 w-full rounded-full border-none bg-(--swatch-color) outline-none ring-ios-blue ring-offset-2 ring-offset-background data-focus-visible:ring-2",
                "after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:select-none after:text-sm after:text-white/90 after:opacity-0 after:mix-blend-plus-lighter after:transition-opacity after:content-['􀀁'] data-selected:after:opacity-100"
              )}
              id={color}
              key={color}
              style={
                {
                  "--swatch-color":
                    color === "gray"
                      ? "var(--fill-secondary)"
                      : `var(--ios-${color})`,
                } as CSSProperties
              }
            />
          )}
        </ListBox>
      )}
    />
  )
}

function NameInput({ form }: { form: UseFormReturn<NewCategorySchemaType> }) {
  return (
    <Controller
      control={form.control}
      name="name"
      render={({
        field: { name, value, onChange, onBlur, ref },
        fieldState: { invalid },
      }) => (
        <>
          <TextField
            className="w-full"
            isInvalid={invalid}
            isRequired
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            minLength={MIN_CATEGORY_NAME_LENGTH}
            name={name}
            onBlur={onBlur}
            onChange={(v) =>
              onChange(sanitizeName(v, MAX_CATEGORY_NAME_LENGTH))
            }
            validationBehavior="aria"
            value={value}
          >
            <Label className="w-full px-4 pt-6 pb-1.5 font-medium text-label-secondary text-sm uppercase">
              Name
            </Label>
            <Input
              className={cn(
                "h-12 w-full rounded-xl bg-fill-quaternary pr-8.5 pl-4 text-lg leading-none tracking-[0.01em] placeholder-label-secondary",
                "outline-none data-focus-visible:rounded data-focus-visible:ring-4 data-focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)"
              )}
              placeholder="Enter name"
              ref={ref}
            />
          </TextField>
        </>
      )}
    />
  )
}

function EmojiSelect({ form }: { form: UseFormReturn<NewCategorySchemaType> }) {
  const [open, setOpen] = useState(false)
  const selectedIcon = form.getValues("icon")
  const selectedColor = form.watch("color")

  return (
    <>
      <Spacer className="h-4" />

      <Drawer.NestedRoot onOpenChange={setOpen} open={open} showHandle>
        <div className="inline-grid w-full place-content-center">
          <Drawer.Trigger asChild>
            <Button
              className="size-32 overflow-hidden rounded-full font-rnx-rounded text-6xl text-white sm:size-38 sm:text-6xl"
              color={selectedColor}
              size="lg"
              variant="tinted"
            >
              {selectedIcon}
            </Button>
          </Drawer.Trigger>
        </div>

        <Drawer.Content className="h-full">
          <Drawer.Header className="sr-only">
            <Drawer.Title>Select emoji</Drawer.Title>
          </Drawer.Header>

          <Controller
            control={form.control}
            name="icon"
            render={({ field: { onChange, ref } }) => {
              return (
                <EmojiPicker.Root
                  className="flex h-full w-full flex-col px-4"
                  columns={9}
                  onEmojiSelect={({ emoji }) => {
                    onChange(emoji)
                    setOpen(false)
                  }}
                  ref={ref}
                >
                  <Spacer className="h-1" />
                  <EmojiPicker.Search
                    className={cn(
                      "z-10 h-12 w-full appearance-none rounded-[0.6rem] bg-fill-quaternary pr-8.5 pl-3.5 text-lg leading-none tracking-[0.01em] placeholder-label-secondary sm:h-10 sm:pr-7.5",
                      "outline-none data-focus-visible:ring-4 data-focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)",
                      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                    )}
                  />
                  <Spacer className="h-4" />
                  <EmojiPicker.Viewport className="flex-1 outline-hidden">
                    <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-label-secondary text-sm">
                      <Spinner />
                    </EmojiPicker.Loading>
                    <EmojiPicker.Empty className="pointer-events-none absolute inset-0 inline-grid select-none place-content-center font-medium text-base text-label-tertiary tracking-[0.0125em]">
                      No emoji found.
                    </EmojiPicker.Empty>

                    <EmojiPicker.List
                      className="select-none pb-1.5"
                      components={{
                        CategoryHeader: ({ category, ...props }) => (
                          <div
                            className="px-3 pt-3 pb-1.5 font-medium text-label-secondary text-xs"
                            {...props}
                          >
                            {category.label}
                          </div>
                        ),
                        Row: ({ children, ...props }) => (
                          <div
                            className="grid! scroll-my-1.5 grid-cols-9 gap-0.5 px-1.5"
                            {...props}
                          >
                            {children}
                          </div>
                        ),
                        Emoji: ({ emoji, ...props }) => (
                          <button
                            className="flex aspect-square w-full items-center justify-center rounded-md text-2xl hover:bg-fill-secondary data-active:bg-fill-secondary"
                            {...props}
                          >
                            {emoji.emoji}
                          </button>
                        ),
                      }}
                    />
                    <Spacer className="h-4" />
                  </EmojiPicker.Viewport>

                  <Spacer className="h-4" />
                </EmojiPicker.Root>
              )
            }}
          />
        </Drawer.Content>
      </Drawer.NestedRoot>
    </>
  )
}
