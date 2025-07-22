import {useState} from "react"
import {EmojiPicker} from "frimousse"
import {Controller, UseFormReturn} from "react-hook-form"

import {NewAccountSchemaType} from "@/lib/schema/accounts"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {Spacer} from "@/components/ui/spacer"
import {Spinner} from "@/components/loading/spinner"

export function EmojiSelect({
  form,
}: {
  form: UseFormReturn<NewAccountSchemaType>
}) {
  const [open, setOpen] = useState(false)
  const selectedIcon = form.getValues("icon")

  return (
    <>
      <Spacer className="h-4" />

      <Drawer.NestedRoot open={open} onOpenChange={setOpen} showHandle>
        <div className="inline-grid w-full place-content-center">
          <Drawer.Trigger asChild>
            <Button
              className="font-rnx-rounded size-32 rounded-3xl text-6xl text-white sm:size-32 md:size-24 md:text-3xl"
              size="lg"
              color="gray"
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
