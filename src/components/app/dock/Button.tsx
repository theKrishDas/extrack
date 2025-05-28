"use client"

import {ReactNode} from "react"
import {Button as RacButton} from "react-aria-components"

import {cn} from "@/lib/utils"

export default function Button({
  children,
  position = "center",
}: {
  children: ReactNode
  position?: "right" | "center" | "left"
}) {
  return (
    <RacButton
      className={cn(
        // buttonVariants({
        //   variant: "ghost",
        //   size: "lg",
        //   color: "gray",
        //   isIconOnly: true,
        //   className: [
        //     position === "center" && "",
        //     position === "left" && "-mr-2 pl-1!",
        //     position === "right" && "-ml-2 pr-1!",
        //     // "h-14 w-14 sm:h-11 sm:w-11",
        //   ],
        // })

        "group text-label-primary/80 relative isolate z-1 inline-flex h-14 w-13 items-center justify-center text-[1.45rem] sm:h-11 sm:w-10 sm:text-xl",
        position === "center" && "",
        position === "left" && "pl-3",
        position === "right" && "pr-3"
      )}
    >
      {children}

      <span className="bg-fill-opaque group-hover:bg-fill-primary pointer-events-none absolute inset-y-0 -z-1 hidden w-[calc(100%+0.75rem)] rounded-full content-[''] group-hover:inline-block" />
    </RacButton>
  )
}
