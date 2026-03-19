"use client"

import { motion } from "motion/react"
import { usePathname } from "next/navigation"
import { Link, Toolbar } from "react-aria-components"
import { Material } from "../material/material"
import { buttonVariants } from "../ui/button"

function Root({ children }: { children: React.ReactNode }) {
  return (
    <Material
      asChild
      className="inline-flex h-fit w-fit gap-0.5 rounded-full p-1"
      thickness="thick"
      withBorder
    >
      <Toolbar aria-label="Navigation">{children}</Toolbar>
    </Material>
  )
}

function Item({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const path = usePathname()

  return (
    <Link
      className={buttonVariants({
        variant: "ghost",
        className:
          "h-12.5 flex-col items-center justify-center gap-2.25 font-semibold text-[0.625rem] text-label-primary sm:h-12.5 sm:w-20 sm:text-[0.625rem]",
      })}
      href={href}
    >
      <span
        aria-hidden={true}
        className="-mt-0.5 font-rnx-rounded text-[1.35rem] leading-none"
      >
        {icon}
      </span>

      <span className="font-semibold text-[0.625rem]">{children}</span>

      <Pill show={path === href} />
    </Link>
  )
}

/**
 * Uses motion's layout animation to animate the pill when the pathname changes.
 * The animation is handled by motion itself when the component mounts.
 */
function Pill({ show }: { show: boolean }) {
  return (
    <>
      {show && (
        <motion.span
          aria-hidden={true}
          className="active-pathname-pill pointer-events-none absolute inset-0 cursor-none bg-ios-blue/(--label-tertiary-opacity)"
          layoutId="navigation-button-background"
          style={{ borderRadius: 99_999 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1.2,
          }}
        />
      )}
    </>
  )
}

export const Navigation = { Root, Item }
