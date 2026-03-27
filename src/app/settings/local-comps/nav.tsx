"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button/button-variants"
import { cn } from "@/lib/utils"

function Nav({ heading, href }: { heading: string; href: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <header className="relative flex w-full max-w-xl items-center px-4 pt-4 sm:px-0">
        <Link
          className={cn(
            buttonVariants({
              color: "gray",
              isIconOnly: true,
              className: [
                "font-semibold text-lg shadow-black/10 sm:text-base",
                "[--button-bg:var(--background-secondary)] [--button-highlight:var(--ios-blue)]",
              ],
            })
          )}
          href={href}
        >
          􀆉
        </Link>

        <div className="pointer-events-none absolute inset-x-0 flex h-fit select-none items-center justify-center">
          <h1 className="max-w-[65%] truncate font-bold text-label-primary text-xl leading-snug tracking-[0.015rem]">
            {heading}
          </h1>
        </div>
      </header>
    </div>
  )
}

export { Nav as SettingsNav }
