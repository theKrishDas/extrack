import { AnimatePresence, type MotionProps, motion } from "motion/react"
import {
  type ComponentPropsWithoutRef,
  createContext,
  type Key,
  use,
} from "react"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

interface AnimatedContainerContextType {
  ref: (element: HTMLOrSVGElement | null) => void
  height: number
  width: number
}
const AnimatedContainerContext =
  createContext<AnimatedContainerContextType | null>(null)

export interface RootProps
  extends Omit<ComponentPropsWithoutRef<typeof motion.div>, "animate"> {
  animate?: "height" | "width" | "both"
}
const Root = ({ animate = "both", className, ...rest }: RootProps) => {
  const [ref, { height, width }] = useMeasure()
  const value: AnimatedContainerContextType = {
    height,
    width,
    ref: ref as (element: HTMLOrSVGElement | null) => void,
  }

  return (
    <AnimatedContainerContext value={value}>
      <motion.div
        animate={{
          height: animate !== "width" ? height || "fit-content" : "auto",
          width: animate !== "height" ? width || "fit-content" : "auto",
        }}
        className={cn(
          "pointer-events-none relative overflow-hidden",
          {
            height: "h-fit w-auto",
            width: "h-auto w-fit",
            both: "h-fit w-fit",
          }[animate],
          className
        )}
        {...rest}
      />
    </AnimatedContainerContext>
  )
}

export interface ContentProps
  extends ComponentPropsWithoutRef<"div">,
    Pick<MotionProps, "initial" | "animate" | "exit" | "transition"> {
  animationKey: Key
  wrapperClass?: string
}
const Content = ({
  animationKey,
  className,
  wrapperClass,
  initial,
  animate,
  exit,
  transition,
  ...rest
}: ContentProps) => {
  const context = use(AnimatedContainerContext)
  if (!context)
    throw new Error(
      "AnimatedContainer.Content must be used within AnimatedContainer.Root"
    )

  const { ref } = context

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        animate={animate || { opacity: 1 }}
        className={cn("h-fit w-fit", wrapperClass)}
        // TODO: Add these
        exit={exit || { opacity: 0 }}
        initial={initial || { opacity: 0 }}
        key={animationKey}
        transition={transition}
      >
        <div
          className={cn("pointer-events-auto h-auto w-auto", className)}
          ref={ref}
          {...rest}
        />
      </motion.div>
    </AnimatePresence>
  )
}

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.

  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
export function ignoreCircularReferences(): (
  key: string,
  value: unknown
) => unknown {
  const seen = new WeakSet()
  return (key: string, value: unknown): unknown => {
    if (key.startsWith("_")) return undefined // Skip React's internal props
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return undefined
      seen.add(value)
    }
    return value
  }
}

const AnimatedContainer = { Root, Content }
export { AnimatedContainer }
