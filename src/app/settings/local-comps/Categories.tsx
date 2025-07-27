import {CSSProperties, Fragment, useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useMutation, useQuery} from "convex/react"
import {EmojiPicker} from "frimousse"
import {
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Form as RacForm,
  TextField,
} from "react-aria-components"
import {Controller, useForm, UseFormReturn} from "react-hook-form"

import {colors} from "@/lib/constants/colors"
import {
  MAX_CATEGORY_NAME_LENGTH,
  MIN_CATEGORY_NAME_LENGTH,
} from "@/lib/constants/defaults"
import {newCategorySchema, NewCategorySchemaType} from "@/lib/schema/categories"
import {cn, sanitizeName} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {Emoji} from "@/components/ui/emoji"
import {List} from "@/components/ui/list-v2"
import {Spacer} from "@/components/ui/spacer"
import {Spinner} from "@/components/loading/spinner"

export function Categories() {
  const categories = useQuery(api.categories.getAll)

  if (!categories) return <Spinner />

  const incomeCategories = categories.filter(_ => _.type === "income")
  const expenseCategories = categories.filter(_ => _.type === "expense")

  return (
    <>
      <List.Root>
        <List.Header className="relative flex items-center">
          <List.Text level="heading">Expense</List.Text>
          <Button
            size="xs"
            variant="ghost"
            isIconOnly
            className="absolute right-4.5"
            isDisabled
          >
            􀅼
          </Button>
        </List.Header>
        <List.Wrapper>
          {expenseCategories.map(cat => (
            <Item category={cat} key={cat._id} />
          ))}
        </List.Wrapper>

        <List.Header className="relative flex items-center">
          <List.Text level="heading">Income</List.Text>
          <Button
            size="xs"
            variant="ghost"
            isIconOnly
            className="absolute right-4.5"
            isDisabled
          >
            􀅼
          </Button>
        </List.Header>
        <List.Wrapper>
          {incomeCategories.map(cat => (
            <Item category={cat} key={cat._id} />
          ))}
        </List.Wrapper>
      </List.Root>
    </>
  )
}

function Item({category}: {category: Doc<"categories">}) {
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

function CategoryActions({category}: {category: Doc<"categories">}) {
  const [open, setOpen] = useState(false)
  const deleteCategory = useMutation(api.categories.remove)
  const handleDelete = () => {
    deleteCategory({id: category._id})
    setOpen(false)
  }

  return (
    <Drawer.Root
      showHandle
      shouldScaleBackground={false}
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant="ghost"
        color="gray"
        size="sm"
        isIconOnly
        className="touch-auto"
        onPress={() => setOpen(true)}
      >
        􀍠
      </Button>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title srOnly>Actions</Drawer.Title>
        </Drawer.Header>

        <div className="flex flex-col gap-2 px-4 [&_button]:w-full [&_button]:rounded-full">
          <EditCategory category={category} afterEdit={() => setOpen(false)} />
          <DeleteCategory category={category} onDelete={handleDelete} />
        </div>
        <Spacer className="h-4" />
      </Drawer.Content>
    </Drawer.Root>
  )
}

function EditCategory({
  category,
  afterEdit,
}: {
  category: Doc<"categories">
  afterEdit?: () => void
}) {
  const update = useMutation(api.categories.update)
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
    formState: {isDirty, defaultValues},
    getValues,
  } = form

  const editable = isDirty && defaultValues !== getValues()

  const onSubmit = (data: NewCategorySchemaType) => {
    if (!editable) return

    const {name, icon, color} = data
    update({id: category._id, name, icon, color})

    afterEdit?.()
  }

  return (
    <Drawer.NestedRoot shouldScaleBackground={false}>
      <Drawer.Trigger asChild>
        <Button color="gray" size="lg">
          Edit
        </Button>
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
              type="submit"
              variant="filled"
              fullWidth
              isDisabled={!editable}
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
    <Drawer.NestedRoot shouldScaleBackground={false}>
      <Drawer.Trigger asChild>
        <Button
          color="red"
          variant="tinted"
          size="lg"
          isDisabled={category.is_vendor}
        >
          Delete
        </Button>
      </Drawer.Trigger>

      {category.is_vendor && (
        <List.Text className="text-center" level="footer">
          This is a pre-shipped category and can’t be deleted.
        </List.Text>
      )}

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Delete {category.name}?</Drawer.Title>
        </Drawer.Header>
        <div className="flex flex-col gap-2 px-4">
          <p>
            You are about to delete this category. All your transactions with
            this category will be deleted aswell!
          </p>

          <Drawer.ClosePrimitive asChild>
            <Button color="gray" fullWidth>
              Cancel
            </Button>
          </Drawer.ClosePrimitive>

          <Drawer.ClosePrimitive asChild>
            <Button color="red" fullWidth onPress={onDelete}>
              Delete
            </Button>
          </Drawer.ClosePrimitive>
        </div>
        <Spacer className="h-4" />
      </Drawer.Content>
    </Drawer.NestedRoot>
  )
}

function SelectColor({form}: {form: UseFormReturn<NewCategorySchemaType>}) {
  return (
    <Controller
      control={form.control}
      name="color"
      render={({field: {value, onChange, onBlur, ref}}) => (
        <ListBox
          ref={ref}
          items={colors.map(color => ({color}))}
          aria-label="colors"
          selectionMode="single"
          shouldFocusWrap
          disallowEmptySelection
          orientation="horizontal"
          className="flex w-full items-center justify-center gap-0.5 px-0.5 sm:gap-2"
          onBlur={onBlur}
          selectedKeys={[value]}
          onSelectionChange={([key]) => onChange(key)}
        >
          {({color}) => (
            <ListBoxItem
              key={color}
              id={color}
              className={cn(
                "ring-ios-blue ring-offset-background relative h-10 w-full rounded-full border-none bg-[var(--swatch-color)] ring-offset-2 outline-none data-focus-visible:ring-2",
                "after:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-sm after:text-white/90 after:opacity-0 after:mix-blend-plus-lighter after:transition-opacity after:content-['􀀁'] after:select-none data-selected:after:opacity-100"
              )}
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

function NameInput({form}: {form: UseFormReturn<NewCategorySchemaType>}) {
  return (
    <Controller
      control={form.control}
      name="name"
      render={({
        field: {name, value, onChange, onBlur, ref},
        fieldState: {invalid},
      }) => (
        <Fragment>
          <TextField
            name={name}
            value={value}
            onChange={v => onChange(sanitizeName(v, MAX_CATEGORY_NAME_LENGTH))}
            minLength={MIN_CATEGORY_NAME_LENGTH}
            maxLength={MAX_CATEGORY_NAME_LENGTH}
            onBlur={onBlur}
            isRequired
            validationBehavior="aria"
            isInvalid={invalid}
            className="w-full"
          >
            <Label className="text-label-secondary w-full px-4 pt-6 pb-1.5 text-sm font-medium uppercase">
              Name
            </Label>
            <Input
              ref={ref}
              placeholder="Enter name"
              className={cn(
                "placeholder-label-secondary bg-fill-quaternary h-12 w-full rounded-xl pr-8.5 pl-4 text-lg leading-none tracking-[0.01em]",
                "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:rounded data-[focus-visible]:ring-4"
              )}
            />
          </TextField>
        </Fragment>
      )}
    />
  )
}

function EmojiSelect({form}: {form: UseFormReturn<NewCategorySchemaType>}) {
  const [open, setOpen] = useState(false)
  const selectedIcon = form.getValues("icon")
  const selectedColor = form.watch("color")

  return (
    <>
      <Spacer className="h-4" />

      <Drawer.NestedRoot open={open} onOpenChange={setOpen} showHandle>
        <div className="inline-grid w-full place-content-center">
          <Drawer.Trigger asChild>
            <Button
              className="font-rnx-rounded size-32 overflow-hidden rounded-full text-6xl text-white sm:size-38 sm:text-6xl"
              size="lg"
              color={selectedColor}
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
            render={({field: {onChange, ref}}) => {
              return (
                <EmojiPicker.Root
                  ref={ref}
                  className="flex h-full w-full flex-col px-4"
                  columns={9}
                  onEmojiSelect={({emoji}) => {
                    onChange(emoji)
                    setOpen(false)
                  }}
                >
                  <Spacer className="h-1" />
                  <EmojiPicker.Search
                    className={cn(
                      "placeholder-label-secondary bg-fill-quaternary z-10 h-12 w-full appearance-none rounded-[0.6rem] pr-8.5 pl-3.5 text-lg leading-none tracking-[0.01em] sm:h-10 sm:pr-7.5",
                      "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] outline-none data-[focus-visible]:ring-4",
                      "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                    )}
                  />
                  <Spacer className="h-4" />
                  <EmojiPicker.Viewport className="flex-1 outline-hidden">
                    <EmojiPicker.Loading className="text-label-secondary absolute inset-0 flex items-center justify-center text-sm">
                      <Spinner />
                    </EmojiPicker.Loading>
                    <EmojiPicker.Empty className="text-label-tertiary pointer-events-none absolute inset-0 inline-grid place-content-center text-base font-medium tracking-[0.0125em] select-none">
                      No emoji found.
                    </EmojiPicker.Empty>

                    <EmojiPicker.List
                      className="pb-1.5 select-none"
                      components={{
                        CategoryHeader: ({category, ...props}) => (
                          <div
                            className="text-label-secondary px-3 pt-3 pb-1.5 text-xs font-medium"
                            {...props}
                          >
                            {category.label}
                          </div>
                        ),
                        Row: ({children, ...props}) => (
                          <div
                            className="grid! scroll-my-1.5 grid-cols-9 gap-0.5 px-1.5"
                            {...props}
                          >
                            {children}
                          </div>
                        ),
                        Emoji: ({emoji, ...props}) => (
                          <button
                            className="hover:bg-fill-secondary data-[active]:bg-fill-secondary flex aspect-square w-full items-center justify-center rounded-md text-2xl"
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
