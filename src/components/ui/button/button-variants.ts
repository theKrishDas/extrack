import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  [
    "relative inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap px-5 font-medium leading-0 tracking-[0.01em]",
    "disabled:pointer-events-none disabled:bg-fill-secondary disabled:text-label-tertiary disabled:opacity-50", // Disabled
    "cursor-default touch-none select-none", // cursor and select
  ],
  {
    variants: {
      variant: {
        gray: "bg-[var(--button-bg)] text-[var(--button-color)] [--button-bg:var(--fill-tertiary)] [--button-highlight:var(--fill-primary)] dasabled:[--button-bg:var(--fill-secondary)]",
        filled:
          "bg-[var(--button-bg)] text-[var(--button-fg,_white)] [--button-bg:var(--button-color)] [--button-highlight:color-mix(in_oklch,var(--button-color),var(--button-fg,white)_30%)] dasabled:[--button-bg:var(--fill-secondary)]",
        tinted:
          "bg-[var(--button-bg)] text-[var(--button-color)] [--button-bg:color-mix(in_oklch,var(--button-color)_var(--fill-tertiary-opacity),transparent)] [--button-highlight:color-mix(in_oklch,var(--button-color)_var(--label-tertiary-opacity),transparent)] dasabled:[--button-bg:var(--fill-secondary)]",
        ghost:
          "bg-[var(--button-bg)] text-[var(--button-color)] [--button-bg:var(--fill-opaque)] [--button-highlight:var(--fill-primary)]",
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
        lg: "h-14 rounded-[0.85rem] text-[1.05rem] sm:h-11 sm:px-4 sm:text-[0.9rem] [&_svg]:text-[1.2rem] sm:[&_svg]:text-[1.1rem]",
        md: "h-12 rounded-full text-base sm:h-9 sm:px-3 sm:text-sm [&_svg]:text-xl sm:[&_svg]:text-base",
        sm: "h-10 rounded-full px-4 text-sm sm:h-8 sm:px-3 sm:text-xs [&_svg]:text-base sm:[&_svg]:text-sm",
        xs: "h-8 rounded-full px-3 text-[0.95rem] tracking-[0.02em] sm:h-7 sm:px-2.5 sm:text-[0.8rem] [&_svg]:text-base sm:[&_svg]:text-sm",
      },
      isIconOnly: {
        true: "gap-0 rounded-full p-0 sm:p-0",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      focusTreatment: {
        // use the default focus-visible selector for default buttons
        default:
          "ring-[var(--button-color)]/50 ring-offset-background focus:outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2", // focus
        // use data-focus-visible attribute for RACButtons
        aria: "ring-[var(--button-color)]/50 ring-offset-background focus:outline-none focus-visible:outline-none data-focus-visible:ring-4 data-focus-visible:ring-offset-2",
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
      {
        isIconOnly: true,
        size: "xs",
        class:
          "h-7 w-7 text-sm sm:h-7 sm:w-7 sm:text-sm [&_svg]:text-[1.3rem] sm:[&_svg]:text-[1.1rem]",
      },
    ],
    defaultVariants: {
      variant: "gray",
      color: "blue",
      size: "md",
      isIconOnly: false,
      fullWidth: false,
      focusTreatment: "default",
    },
  }
)
