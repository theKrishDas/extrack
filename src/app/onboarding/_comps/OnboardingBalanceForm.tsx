import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import { AnimatePresence, motion, type Transition } from "motion/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Form as RacForm } from "react-aria-components"
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form"
import { toast } from "sonner"
import z from "zod/v3"
import { api } from "#/convex/_generated/api"
import { limit } from "#lib/constants/constraints"
import { v } from "#lib/validators"
import { wait } from "@/lib/utils"
import { Balance } from "./Balance"
import { ContinueButton } from "./ContinueButton"
import type { LoadingState, OnboardingStep } from "./helpers"
import { Welcome } from "./Welcome"

const onboardingBalanceSchema = z.object({
  amount: v.dollars(
    limit.amount.account.startingBalance.min,
    limit.amount.account.startingBalance.max / 100 // Convert from cents to dollars
  ),
})
export type BalanceFormValues = z.infer<typeof onboardingBalanceSchema>

export function OnboardingBalanceForm({
  activeStep,
  nextStep,
}: {
  activeStep: OnboardingStep
  nextStep: () => void
}) {
  const { push } = useRouter()

  const [loading, setLoading] = useState<LoadingState>("idle")

  const defaultAccount = useQuery(api.account.getDefault)
  const updateStartingBalance = useMutation(api.account.setStartingBalance)

  const form = useForm<BalanceFormValues>({
    resolver: zodResolver(onboardingBalanceSchema),
  })
  const onSubmit: SubmitHandler<BalanceFormValues> = async (data) => {
    const amount = data.amount * 100
    try {
      if (!defaultAccount) {
        console.error(
          JSON.stringify({
            severity: "CRITICAL",
            invariant: "ONBOARDING_DEFAULT_ACCOUNT_MISSING",
            activeStep,
            amount,
            message:
              "Invariant violated: onboarding balance submission requires a default account",
          })
        )
        throw new Error(
          "Internal invariant violated: onboarding default account is missing"
        )
      }

      setLoading("loading")
      await updateStartingBalance({ id: defaultAccount, balance: amount })
      setLoading("done")
      await wait(800)
      push("/")
    } catch {
      setLoading("idle")
      toast.error("We couldn't save your balance. Please try again.")
    }
  }

  const handleContinue = async () => {
    if (loading !== "idle") return
    if (activeStep === "welcome") {
      nextStep()
      return
    }
    await form.handleSubmit(onSubmit)()
  }

  return (
    <RacForm
      className="flex h-full flex-col"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <StepContent activeStep={activeStep} form={form} />
      <ContinueButton
        activeStep={activeStep}
        loading={loading}
        onContinue={handleContinue}
      />
    </RacForm>
  )
}

function StepContent({
  activeStep,
  form,
}: {
  activeStep: OnboardingStep
  form: UseFormReturn<BalanceFormValues>
}) {
  const transition = {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 1,
  } satisfies Transition

  return (
    <AnimatePresence mode="popLayout">
      {activeStep === "welcome" ? (
        <motion.div
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          className="flex flex-1 flex-col"
          exit={{ opacity: 0, x: -12, filter: "blur(3px)" }}
          initial={false}
          key="welcome"
          transition={transition}
        >
          <Welcome />
        </motion.div>
      ) : (
        <motion.div
          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: { ...transition, delay: 0.2 },
          }}
          className="flex flex-1 flex-col"
          exit={{ opacity: 0, x: -12, filter: "blur(3px)" }}
          initial={{ opacity: 0, x: 12, filter: "blur(3px)" }}
          key="balance"
          transition={transition}
        >
          <Balance form={form} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
