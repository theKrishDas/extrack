"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import {
  Switch as RacSwitch,
  type SwitchProps as RacSwitchProps,
} from "react-aria-components"
import { Spinner } from "@/components/loading/spinner"
import { cn } from "@/lib/utils"

export interface SwitchProps extends Omit<RacSwitchProps, "children"> {
  children: ReactNode
  hideLabel?: boolean
  isPending?: boolean
}
function Switch({
  children,
  hideLabel = true,
  isPending = false,
  isDisabled,
  ...rest
}: SwitchProps) {
  return (
    <RacSwitch
      className="group/switch inline-flex items-center gap-1.5"
      data-pending={!!isPending}
      isDisabled={isDisabled || isPending}
      {...rest}
    >
      {({ isSelected }) => (
        <>
          <motion.div
            className={cn(
              "switchIndicator flex h-7 w-16 touch-none select-none rounded-full border-3 border-transparent bg-fill-primary transition-all group-data-selected/switch:bg-ios-green group-data-disabled/switch:opacity-40",
              "ring-ios-blue ring-offset-2 ring-offset-background group-data-focus-visible/switch:ring-2"
            )}
            style={{ justifyContent: isSelected ? "flex-end" : "flex-start" }}
          >
            <motion.div
              className="switchPill inline-grid h-full w-9.5 place-content-center rounded-full bg-white shadow group-data-pressed/switch:w-10.5"
              layoutId={Math.random().toString()}
              style={{ borderRadius: "99999px" }}
            >
              {isPending && <Spinner className="text-gray-2 text-sm" />}
            </motion.div>
          </motion.div>
          <span className={cn(hideLabel && "sr-only")}>{children}</span>
        </>
      )}
    </RacSwitch>
  )
}

export { Switch }
