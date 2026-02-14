"use client"

import type { VariantProps } from "class-variance-authority"
import { motion, type Variants } from "motion/react"
import { useAnimate } from "motion/react-mini"
import { type ReactNode, useState } from "react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/lib/utils"

import { LucideCheck } from "../icons/lucide"
import { buttonVariants } from "./button"

const MRacButton = motion.create(RacButton)

type ButtonVariantTypes = Omit<
  VariantProps<typeof buttonVariants>,
  "focusTreatment" | "isIconOnly" | "size"
>

function ConfirmButton({
  onConfirm,
  confirmLabel = "Confirm",
  restLabel: label = "Delete",
  confirmIcon = <LucideCheck />,
  restVariants,
  confirmVariants,
  size,
  className,
}: {
  onConfirm?: () => void
  confirmLabel?: string
  restLabel?: string
  confirmIcon?: ReactNode
  restVariants?: ButtonVariantTypes
  confirmVariants?: ButtonVariantTypes
  size?: VariantProps<typeof buttonVariants>["size"]
  className?: string
}) {
  const [isConfirming, setConfirming] = useState(false)
  const [scope, animate] = useAnimate()

  const variants: Variants = {
    visible: { opacity: 1, filter: "blur(0px)" },
    hidden: { opacity: 0, filter: "blur(8px)" },
  }

  return (
    <MRacButton
      className={cn(
        buttonVariants({
          variant: isConfirming
            ? (confirmVariants?.variant ?? "tinted")
            : restVariants?.variant,
          color: isConfirming
            ? (confirmVariants?.color ?? "red")
            : restVariants?.color,
          size,
          className,
        })
      )}
      onPress={() => {
        if (isConfirming) onConfirm?.()
        setConfirming((v) => !v)
        animate(scope.current, {
          backgroundColor: "var(--button-bg)",
          filter: [null, "blur(3px)", "blur(0px)"],
        })
      }}
      onPressEnd={() =>
        animate(scope.current, {
          backgroundColor: "var(--button-bg)",
          scale: 1,
        })
      }
      onPressStart={() =>
        animate(
          scope.current,
          { backgroundColor: "var(--button-highlight)", scale: 0.975 },
          { duration: 0 }
        )
      }
      ref={scope}
    >
      <motion.span
        animate={isConfirming ? "visible" : "hidden"}
        className="inline-flex h-full w-full items-center justify-center gap-1"
        initial="hidden"
        variants={variants}
      >
        {confirmIcon}
        {confirmLabel}
      </motion.span>

      <motion.span
        animate={isConfirming ? "hidden" : "visible"}
        className="absolute"
        initial="visible"
        variants={variants}
      >
        {label}
      </motion.span>
    </MRacButton>
  )
}

export { ConfirmButton }
