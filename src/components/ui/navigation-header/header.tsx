"use client"

import {useRouter} from "next/navigation"

import {cn} from "@/lib/utils"

import {Button} from "../button/animated-button"
import {Spacer} from "../spacer"

export interface HeaderProps {
  title: string
  srOnly?: boolean
  href?: string
}

export function Header({title, srOnly = false, href = ""}: HeaderProps) {
  const router = useRouter()

  return (
    // NOTE: These heights are coming from button's height
    <header className="relative flex h-11 w-full items-center sm:h-9">
      <div className="absolute flex h-full w-full flex-1 items-center justify-center">
        <h1
          className={cn(
            "text-label-primary max-w-[65%] truncate text-xl font-semibold tracking-[0.015rem]",
            srOnly && "sr-only"
          )}
        >
          {title}
        </h1>
      </div>

      <Button
        color="gray"
        className={cn(
          "text-lg font-normal shadow-[0_0_12px] shadow-black/10 sm:text-base",
          "[--button-bg:var(--background)] [--button-highlight:var(--fill-primary)]",
          "dark:[--button-bg:var(--fill-quaternary)]"
        )}
        onPress={() => router.push(href, {scroll: false})}
        isIconOnly
      >
        􀆉
      </Button>

      <Spacer className="flex-1" />
    </header>
  )
}
