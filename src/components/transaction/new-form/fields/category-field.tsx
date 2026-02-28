import { useState } from "react"
import { ListBox, ListBoxItem } from "react-aria-components"
import type { Doc } from "#/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Drawer } from "@/components/ui/drawer/base-ui-drawer"
import { Emoji } from "@/components/ui/emoji"
import { cn, wait } from "@/lib/utils"
import { useFieldContext } from "../hooks/form-context"

export function CategoryField({
  categories,
}: {
  categories: Doc<"categories">[] | undefined
}) {
  const [open, setOpen] = useState(false)
  const field = useFieldContext<string>()
  const isPending = !categories

  return (
    <>
      <Button
        className="data-pending:animate-pulse data-pending:bg-fill-primary"
        color="gray"
        isPending={isPending}
        onPress={() => setOpen(true)}
        size="sm"
      >
        􀏪
      </Button>

      {!isPending && (
        <Drawer.Root onOpenChange={setOpen} open={open}>
          <Drawer.Content className="">
            <Drawer.Title>Select category for this transaction</Drawer.Title>

            <ListBox
              aria-label="Categories"
              className="ListBoxRoot block p-0 [&_.ListBoxItem]:first:rounded-t-2xl [&_.ListBoxItem]:last:rounded-b-2xl [&_.ListBoxItem]:last:supports-[corner-shape:squircle]:rounded-b-4xl [&_.ListBoxItem]:first:supports-[corner-shape:squircle]:rounded-t-4xl"
              disallowEmptySelection
              items={categories}
              onBlur={field.handleBlur}
              onSelectionChange={async ([key]) => {
                field.handleChange(String(key))
                await wait(450) // artificial delay to complete the indicator animation
                setOpen(false)
              }}
              selectedKeys={[field.state.value]}
              selectionMode="single"
              shouldFocusWrap
            >
              {(cat) => (
                <ListBoxItem
                  className={({ isFocusVisible }) =>
                    cn(
                      "group/ListBoxItem ListBoxItem relative flex h-12 w-full select-none items-center bg-fill-quaternary px-4 outline-none",
                      "supports-[corner-shape:squircle]:corner-squircle",
                      "data-hovered:bg-fill-tertiary data-pressed:bg-fill-secondary",
                      isFocusVisible === true &&
                        "rounded-sm! ring-3 ring-ios-blue",

                      // active indicator
                      "after:absolute after:top-1/2 after:right-4 after:-translate-y-1/2 after:scale-80 after:text-ios-blue after:text-xl after:opacity-0 after:transition-all after:duration-250 after:content-['􀆅'] data-selected:after:block data-selected:after:scale-100 data-selected:after:opacity-100"
                    )
                  }
                  id={cat._id}
                >
                  <Emoji
                    aria-hidden={true}
                    className={cn(
                      "mr-3 flex items-center gap-3"
                      // Color swatch before the icon
                      // "before:supports-[corner-shape:squircle]:corner-squircle before:block before:size-4 before:bg-(--item-color) before:content-[''] before:supports-[corner-shape:squircle]:rounded-xl"
                    )}
                    style={
                      {
                        "--item-color": `var(--ios-${cat.color}, var(--foreground))`,
                      } as React.CSSProperties
                    }
                  >
                    {cat.icon}
                  </Emoji>
                  <span className="font-medium">{cat.name}</span>
                </ListBoxItem>
              )}
            </ListBox>
          </Drawer.Content>
        </Drawer.Root>
      )}
    </>
  )
}
