"use client"

import { Popover } from "@base-ui/react/popover"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { useState } from "react"
import { RxPlus } from "react-icons/rx"
import { physics } from "@/components/app/dock"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Uses per-property transitions instead of one shared transition.
 *
 * The spring physics (`scale`) intentionally overshoots to create a bounce.
 * That overshoot makes visual properties like `opacity` and `blur` briefly
 * go past their limits (e.g. negative opacity or blur < 0), which causes
 * visible flicker. To prevent this, `opacity` and `filter` use a short
 * linear transition while only `scale` uses the spring physics.
 */
const popupVariants: Variants = {
  initial: { opacity: 0, filter: "blur(3px)", scale: 0.95 },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      ...physics,
      opacity: { duration: 0.2, ease: "linear" },
      filter: { duration: 0.2, ease: "linear" },
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(3px)",
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

export function FAB() {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root modal={true} onOpenChange={setOpen} open={open}>
      <Popover.Trigger
        render={
          <Button
            className="text-label-primary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/2.5 backdrop-blur-2xl"
            color="gray"
            isIconOnly
            size="lg"
          />
        }
      >
        <RxPlus />
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal keepMounted>
            <Popover.Backdrop
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              }
            />
            <Popover.Positioner
              align="end"
              alignOffset={-18}
              className="z-50 *:outline-none"
              side="top"
              sideOffset={-64}
            >
              <Popover.Popup
                className={cn(
                  "h-fit w-fit bg-background-tertiary/80 backdrop-blur-md",
                  "shadow-lg dark:shadow-[inset_0_1px,inset_0_0_0_1px] dark:shadow-white/2.5",
                  "rounded-4xl supports-[corner-shape:squircle]:rounded-[3rem] supports-[corner-shape:superellipse(1.5)]:[corner-shape:superellipse(1.5)]"
                )}
                render={
                  <motion.div
                    animate="animate"
                    exit="exit"
                    initial="initial"
                    style={{ transformOrigin: "bottom right" }}
                    variants={popupVariants}
                  />
                }
              >
                <div
                  className={cn(
                    "flex h-fit w-55 flex-col gap-1.5 p-4",
                    "[&>button]:w-full [&>button]:rounded-full [&>button]:text-label-primary"
                  )}
                >
                  {/* visually align the labels to the left */}
                  <Button aria-label="Add income" color="gray" size="lg">
                    <span className="-ml-2.25 inline-block">􀄨 Income</span>
                  </Button>
                  <Button aria-label="Add expence" color="gray" size="lg">
                    􀄩 Expence
                  </Button>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
