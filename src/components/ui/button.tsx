"use client"

import {forwardRef} from "react"
import {cva, VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {}

const buttonVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 px-5 leading-none font-medium tracking-[0.01em] whitespace-nowrap",
    "disabled:text-label-tertiary disabled:bg-fill-secondary disabled:pointer-events-none disabled:opacity-50", // Disabled
    "cursor-default touch-none select-none", // cursor and select
  ],
  {
    variants: {
      variant: {
        gray: "bg-[var(--button-bg)] text-[var(--button-color)] [--button-bg:var(--fill-tertiary)] [--button-highlight:var(--fill-primary)]",
        filled:
          "bg-[var(--button-bg)] text-[var(--button-fg,_white)] [--button-bg:var(--button-color)] [--button-highlight:color-mix(in_oklch,var(--button-color),var(--button-fg,white)_30%)]",
        tinted:
          "bg-[var(--button-bg)] text-[var(--button-color)] [--button-bg:color-mix(in_oklch,var(--button-color)_var(--fill-tertiary-opacity),transparent)] [--button-highlight:color-mix(in_oklch,var(--button-color)_var(--label-tertiary-opacity),transparent)]",
        ghost:
          "text-[var(--button-color)] bg-[var(--button-bg)] [--button-highlight:var(--fill-primary)] [--button-bg:var(--fill-opaque)]",
        // "hover:bg-[var(--button-color)]/[var(--fill-quaternary-opacity)]",
      },
      color: {
        blue: "[--button-color:var(--ios-blue)]",
        red: "[--button-color:var(--ios-red)]",
        orange: "[--button-color:var(--ios-orange)]",
        yellow: "[--button-color:var(--ios-yellow)]",
        green: "[--button-color:var(--ios-green)]",
        mint: "[--button-color:var(--ios-mint)]",
        teal: "[--button-color:var(--ios-teal)]",
        cyan: "[--button-color:var(--ios-cyan)]",
        indigo: "[--button-color:var(--ios-indigo)]",
        purple: "[--button-color:var(--ios-purple)]",
        pink: "[--button-color:var(--ios-pink)]",
        brown: "[--button-color:var(--ios-brown)]",
        gray: "[--button-color:var(--label-secondary)]",
      },
      size: {
        lg: "h-14 sm:px-4 rounded-[0.85rem] text-base sm:h-11 sm:text-sm [&_svg]:text-[1.3rem] sm:[&_svg]:text-lg",
        md: "h-12 rounded-full text-base sm:h-9 sm:px-4 sm:text-sm [&_svg]:text-xl sm:[&_svg]:text-lg",
        sm: "h-10 rounded-full px-4 text-sm sm:h-8 sm:px-3 sm:text-xs [&_svg]:text-base sm:[&_svg]:text-sm",
      },
      isIconOnly: {
        true: "gap-0 rounded-full p-0 leading-none sm:p-0",
        false: "",
      },
      focusTreatment: {
        true: "ring-[var(--button-color)]/50 ring-offset-background focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:outline-none", // focus
        false: "",
      },
    },
    compoundVariants: [
      {
        isIconOnly: true,
        size: "lg",
        class:
          "h-14 w-14 text-[1.75rem] sm:h-11 sm:w-11 sm:text-xl [&_svg]:text-[1.75rem] sm:[&_svg]:text-xl",
      },
      {
        isIconOnly: true,
        size: "md",
        class: "h-11 w-11 text-2xl sm:h-9 sm:w-9 [&_svg]:text-2xl",
      },
      {
        isIconOnly: true,
        size: "sm",
        class:
          "h-9 w-9 text-xl sm:h-8 sm:w-8 sm:text-sm [&_svg]:text-[1.2rem] sm:[&_svg]:text-base",
      },
    ],
    defaultVariants: {
      variant: "gray",
      color: "blue",
      size: "md",
      isIconOnly: false,
      focusTreatment: true,
    },
  }
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {className, variant, color, size, isIconOnly, focusTreatment, ...rest},
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({
            variant,
            color,
            size,
            isIconOnly,
            focusTreatment,
            className,
          })
        )}
        {...rest}
        ref={ref}
      />
    )
  }
)
Button.displayName = "Button"

export {Button, buttonVariants}
