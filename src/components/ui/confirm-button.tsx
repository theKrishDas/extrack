"use client"

import {ReactNode, useState} from "react"
import {VariantProps} from "class-variance-authority"
import {motion, Variants} from "motion/react"
import {useAnimate} from "motion/react-mini"
import {Button as RacButton} from "react-aria-components"

import {cn} from "@/lib/utils"

import {LucideCheck} from "../icons/lucide"
import {buttonVariants} from "./button"

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
    visible: {opacity: 1, filter: "blur(0px)"},
    hidden: {opacity: 0, filter: "blur(8px)"},
  }

  return (
    <MRacButton
      ref={scope}
      className={cn(
        buttonVariants({
          variant: isConfirming
            ? (confirmVariants?.variant ?? "tinted")
            : restVariants?.variant,
          color: isConfirming
            ? (confirmVariants?.color ?? "red")
            : restVariants?.color,
          size,
          className: className,
        })
      )}
      onPress={() => {
        if (isConfirming) onConfirm?.()
        setConfirming(v => !v)
        animate(scope.current, {
          backgroundColor: "var(--button-bg)",
          filter: [null, "blur(3px)", "blur(0px)"],
        })
      }}
      onPressStart={() =>
        animate(
          scope.current,
          {backgroundColor: "var(--button-highlight)", scale: 0.975},
          {duration: 0}
        )
      }
      onPressEnd={() =>
        animate(scope.current, {backgroundColor: "var(--button-bg)", scale: 1})
      }
    >
      <motion.span
        className="inline-flex h-full w-full items-center justify-center gap-1"
        variants={variants}
        initial="hidden"
        animate={isConfirming ? "visible" : "hidden"}
      >
        {confirmIcon}
        {confirmLabel}
      </motion.span>

      <motion.span
        className="absolute"
        variants={variants}
        initial="visible"
        animate={!isConfirming ? "visible" : "hidden"}
      >
        {label}
      </motion.span>
    </MRacButton>
  )
}

export {ConfirmButton}
