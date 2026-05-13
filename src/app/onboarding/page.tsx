"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ONBOARDING_STEPS } from "./_comps/helpers"
import { OnboardingBalanceForm } from "./_comps/OnboardingBalanceForm"

export default function Page() {
  const [count, setCount] = useState<number>(0)
  const nextStep = () =>
    setCount((c) => Math.min(c + 1, ONBOARDING_STEPS.length - 1))
  // biome-ignore lint/correctness/noUnusedVariables: keep this handler
  const previousStep = () => setCount((c) => Math.max(c - 1, 0))
  // biome-ignore lint/correctness/noUnusedVariables: keep this handler
  const cycleSteps = () => setCount((c) => (c + 1) % ONBOARDING_STEPS.length)
  const activeStep = ONBOARDING_STEPS[count] ?? ONBOARDING_STEPS[0]

  return (
    <>
      <span className="pointer-events-none absolute inset-0 bg-[#F7F8F7] dark:bg-background" />
      <main className="h-svh px-4 pb-16 md:px-0">
        <Container className="relative h-full">
          <OnboardingBalanceForm activeStep={activeStep} nextStep={nextStep} />
          <SkipButton isVisible={activeStep === "balance"} />
        </Container>
      </main>
    </>
  )
}

const MLink = motion.create(Link)
function SkipButton({ isVisible }: { isVisible: boolean }) {
  return (
    <MLink
      animate={isVisible ? "shown" : "hidden"}
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "absolute top-4 right-0"
      )}
      href="/"
      initial="hidden"
      variants={{
        hidden: { opacity: 0 },
        shown: { opacity: 1, transition: { delay: 0.575 } },
      }}
    >
      Skip
    </MLink>
  )
}
