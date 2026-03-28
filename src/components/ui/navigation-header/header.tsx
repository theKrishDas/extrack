"use client"

import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

import { Button } from "../button/animated-button"
import { Spacer } from "../spacer"

export interface HeaderProps {
  title: string
  srOnly?: boolean
  href?: string
}

/**
 * @deprecated Use `PageHeader` from `@/components/navigation/page-header` instead.
 */
export function Header({ title, srOnly = false, href = "" }: HeaderProps) {
  const router = useRouter()

  return (
    // NOTE: These heights are coming from button's height
    <header className="relative flex h-11 w-full items-center sm:h-9">
      <div className="absolute flex h-full w-full flex-1 items-center justify-center">
        <h1
          className={cn(
            "max-w-[65%] truncate font-semibold text-label-primary text-xl tracking-[0.015rem]",
            srOnly && "sr-only"
          )}
        >
          {title}
        </h1>
      </div>

      <Button
        className={cn(
          "font-normal text-lg shadow-[0_0_12px] shadow-black/10 sm:text-base",
          "[--button-bg:var(--background)] [--button-highlight:var(--fill-primary)]",
          "dark:[--button-bg:var(--fill-quaternary)]"
        )}
        color="gray"
        isIconOnly
        onPress={() => router.push(href, { scroll: false })}
      >
        􀆉
      </Button>

      <Spacer className="flex-1" />
    </header>
  )
}
