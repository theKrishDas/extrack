import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { ConvexError } from "convex/values"
import { EmojiPicker } from "frimousse"
import { type CSSProperties, useEffect, useState } from "react"
import {
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Form as RacForm,
  TextField,
} from "react-aria-components"
import {
  Controller,
  type UseFormReturn,
  useForm,
  useWatch,
} from "react-hook-form"
import { toast } from "sonner"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { type Colors, colors } from "#lib/constants/colors"
import { limit } from "#lib/constants/constraints"
import { colorToCSSVar } from "#lib/utils/colors"
import { Spinner } from "@/components/loading/spinner"
import { Button } from "@/components/ui/button/animated-button"
import { DrawerV2 as Drawer } from "@/components/ui/drawer"
import { Emoji } from "@/components/ui/emoji"
import { Spacer } from "@/components/ui/spacer"
import {
  type NewCategorySchemaType,
  newCategorySchema,
} from "@/lib/schema/categories"
import { cn, sanitizeName } from "@/lib/utils"

export function EditCategoryDrawer({
  open,
  onOpenChange,
  category,
  afterEdit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  const { reset } = form

  const editable = form.formState.isDirty

  const onSubmit = (data: NewCategorySchemaType) => {
    if (!editable) return

    const { name, icon, color } = data
    update({ id: category._id, name, icon, color }).catch((err) =>
      toast.error("Failed to edit category", {
        description:
          err instanceof ConvexError
            ? err.data.message
            : "Unknown error occurred",
      })
    )

    afterEdit?.()
  }

  useEffect(() => {
    if (open) return
    reset({
      color: category.color,
      icon: category.icon,
      name: category.name,
      type: category.type,
    })
  }, [open, category, reset])

  return (
    <Drawer.NestedRoot
      onOpenChange={onOpenChange}
      open={open}
      shouldScaleBackground={false}
    >
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

          <Button
            fullWidth
            isDisabled={!editable}
            type="submit"
            variant="filled"
          >
            Done
          </Button>
        </RacForm>
      </Drawer.Content>
    </Drawer.NestedRoot>
  )
}

const colorOptions: { color: Colors }[] = colors.map((color) => ({
  color,
}))
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
          items={colorOptions}
          onBlur={onBlur}
          onSelectionChange={([key]) => onChange(key as Colors)}
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
            maxLength={limit.name.category.max}
            minLength={limit.name.category.min}
            name={name}
            onBlur={onBlur}
            onChange={(v) => onChange(sanitizeName(v, limit.name.category.max))}
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
  const [selectedColor, selectedIcon] = useWatch({
    control: form.control,
    name: ["color", "icon"],
  })

  return (
    <>
      <Spacer className="h-4" />

      <Drawer.NestedRoot
        onOpenChange={setOpen}
        open={open}
        shouldScaleBackground={false}
        showHandle
      >
        <div
          className={cn(
            "relative mx-auto size-fit bg-(--selected-color)/(--fill-tertiary-opacity)",
            "squircle squircle-rounded-3xl rounded-xl"
          )}
          style={
            {
              "--selected-color": colorToCSSVar(selectedColor),
            } as React.CSSProperties
          }
        >
          <Drawer.Trigger className="size-24 rounded-[inherit] outline-none ring-ios-blue/40 ring-offset-ios-blue focus-visible:ring-3 focus-visible:ring-offset-2">
            <Emoji className="text-4xl">{selectedIcon}</Emoji>
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
