"use client"

import {Fragment, ReactNode} from "react"
import {motion} from "motion/react"
import {
  Switch as RacSwitch,
  type SwitchProps as RacSwitchProps,
} from "react-aria-components"

import {cn} from "@/lib/utils"
import {Spinner} from "@/components/loading/spinner"

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
      isDisabled={isDisabled || isPending}
      data-pending={isPending ? true : false}
      {...rest}
    >
      {({isSelected}) => (
        <Fragment>
          <motion.div
            className={cn(
              "switchIndicator bg-fill-primary group-data-selected/switch:bg-ios-green flex h-7 w-16 touch-none rounded-full border-3 border-transparent transition-all select-none group-data-disabled/switch:opacity-40",
              "ring-ios-blue ring-offset-background ring-offset-2 group-data-focus-visible/switch:ring-2"
            )}
            style={{justifyContent: isSelected ? "flex-end" : "flex-start"}}
          >
            <motion.div
              className="switchPill inline-grid h-full w-9.5 place-content-center rounded-full bg-white shadow group-data-pressed/switch:w-10.5"
              style={{borderRadius: "99999px"}}
              layoutId={Math.random().toString()}
            >
              {isPending && <Spinner className="text-gray-2 text-sm" />}
            </motion.div>
          </motion.div>
          <span className={cn(hideLabel && "sr-only")}>{children}</span>
        </Fragment>
      )}
    </RacSwitch>
  )
}

export {Switch}
