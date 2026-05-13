import { AnimatePresence, motion, type Variants } from "motion/react"
import type { Colors } from "#lib/constants/colors"
import { Spinner } from "@/components/loading/spinner"
import { Button } from "@/components/ui/button"
import type { LoadingState, OnboardingStep } from "./helpers"

export function ContinueButton({
  activeStep,
  loading,
  onContinue,
}: {
  activeStep: OnboardingStep
  loading: LoadingState
  onContinue: () => void
}) {
  const statusButtonColors: Record<LoadingState, Colors> = {
    idle: "blue",
    loading: "gray",
    done: "green",
  }
  const currentButtonColor = statusButtonColors[loading]

  return (
    <Button
      className="mx-auto gap-0"
      color={currentButtonColor}
      isPending={loading === "loading"}
      onPress={onContinue}
    >
      <StatusIndicator loading={loading} />
      <Label activeStep={activeStep} />
    </Button>
  )
}

const StatusIndicator = ({ loading }: { loading: LoadingState }) => {
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.7,
      filter: "blur(2px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { delay: 0.1 },
    },
  } satisfies Variants

  const shouldShowStatusIcon = loading === "loading" || loading === "done"

  const statusIconsByState: Record<LoadingState, React.ReactNode> = {
    idle: null,
    loading: <Spinner size="0.875em" />,
    done: <span>􀁣</span>,
  }

  return (
    <motion.span
      animate={shouldShowStatusIcon ? "visible" : "hidden"}
      aria-hidden={true}
      className="relative inline-flex h-full items-center overflow-x-clip text-start will-change-transform"
      initial="hidden"
      variants={{
        hidden: {
          width: 0,
          transition: { type: "spring", stiffness: 120, damping: 20 },
        },
        visible: {
          width: "1.5rem",
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
      }}
    >
      <motion.span
        animate={loading === "done" ? "visible" : "hidden"}
        className="absolute w-fit will-change-transform"
        initial="hidden"
        variants={variants}
      >
        {statusIconsByState.done}
      </motion.span>
      <motion.span
        animate={loading === "loading" ? "visible" : "hidden"}
        className="absolute w-fit will-change-transform"
        initial="hidden"
        variants={variants}
      >
        {statusIconsByState.loading}
      </motion.span>
    </motion.span>
  )
}

function Label({ activeStep }: { activeStep: OnboardingStep }) {
  const variants = {
    idle: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.9, filter: "blur(3px)" },
    initial: { opacity: 0, scale: 0.9, filter: "blur(3px)" },
  } as const

  return (
    <motion.span
      animate={activeStep === "welcome" ? "welcome" : "balance"}
      className="relative block h-full"
      initial="welcome"
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      variants={{
        balance: { width: "4rem" },
        welcome: { width: "6.5rem" },
      }}
    >
      <AnimatePresence mode="popLayout">
        {activeStep === "welcome" ? (
          <motion.span
            animate="idle"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            exit="exit"
            initial={false}
            key="welcome"
            variants={variants}
          >
            Setup Account
          </motion.span>
        ) : (
          <motion.span
            animate="idle"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            exit="exit"
            initial="initial"
            key="other"
            variants={variants}
          >
            Continue
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  )
}
