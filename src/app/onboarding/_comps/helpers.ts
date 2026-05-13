export const ONBOARDING_STEPS = ["welcome", "balance"] as const
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]

export type LoadingState = "idle" | "loading" | "done"
