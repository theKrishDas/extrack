import { EmojiPicker } from "frimousse"
import { motion } from "motion/react"
import { useState } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { Doc } from "#/convex/_generated/dataModel"
import type { UpdateAccountSchemaType } from "#lib/schema"
import { Spinner } from "@/components/loading/spinner"
import { Button } from "@/components/ui/button/animated-button"
import { buttonVariants } from "@/components/ui/button/button-variants"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import { Emoji } from "@/components/ui/emoji"
import { Spacer } from "@/components/ui/spacer"
import { cn } from "@/lib/utils"

export function IconPicker({
  form,
  isEditing,
  account,
}: {
  form: UseFormReturn<UpdateAccountSchemaType>
  isEditing: boolean
  account: Doc<"accounts">
}) {
  const [open, setOpen] = useState(false)
  const selectedIcon = isEditing ? form.getValues("icon") : account.icon

  return (
    <motion.div
      animate={isEditing ? "shaking" : "idle"}
      className="relative h-fit w-fit select-none"
      transition={
        isEditing
          ? {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
              duration: 0.15,
            }
          : undefined
      }
      variants={{
        shaking: {
          rotate: [-0, 0, -2],
          x: [0, 1, -1, 0],
        },
        idle: {
          rotate: 0,
          x: 0,
        },
      }}
    >
      <Drawer.NestedRoot onOpenChange={setOpen} open={open} showHandle>
        {isEditing ? (
          <Button
            className="size-32 overflow-hidden rounded-full font-rnx-rounded text-6xl text-white sm:size-38 sm:text-6xl"
            color="gray"
            onPress={() => {
              if (isEditing) setOpen(true)
            }}
            size="lg"
          >
            {selectedIcon}
          </Button>
        ) : (
          <Emoji asChild>
            <div
              className={cn(
                buttonVariants({
                  size: "lg",
                  color: "gray",
                  className:
                    "size-32 overflow-hidden rounded-full text-6xl sm:size-38 sm:text-6xl",
                })
              )}
            >
              {account.icon}
            </div>
          </Emoji>
        )}

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
                      "outline-none data-[focus-visible]:ring-4 data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)]",
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
                            className="flex aspect-square w-full items-center justify-center rounded-md text-2xl hover:bg-fill-secondary data-[active]:bg-fill-secondary"
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
    </motion.div>
  )
}
