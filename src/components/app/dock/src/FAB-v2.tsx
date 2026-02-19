"use client"

import { Popover } from "@base-ui/react/popover"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { useState } from "react"
import { RxPlus } from "react-icons/rx"
import { physics } from "@/components/app/dock"
import { Material } from "@/components/material/material"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const popupVariants: Variants = {
  initial: { opacity: 0, filter: "blur(3px)", scale: 0.95 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1, transition: physics },
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
      <Popover.Trigger render={<Button color="gray" isIconOnly size="lg" />}>
        <RxPlus />
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal keepMounted>
            <Popover.Backdrop
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs"
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
                <Material
                  className={cn(
                    "flex h-fit w-55 flex-col gap-1.5 p-4 [&>button]:w-full [&>button]:rounded-full",
                    "rounded-4xl supports-[corner-shape:squircle]:rounded-[3rem] supports-[corner-shape:superellipse(1.5)]:[corner-shape:superellipse(1.5)]"
                  )}
                  thickness="thick"
                  withBorder
                >
                  <Button color="gray" size="lg">
                    􀄨 Income
                  </Button>
                  <Button color="gray" size="lg">
                    􀄩 Expence
                  </Button>
                </Material>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
