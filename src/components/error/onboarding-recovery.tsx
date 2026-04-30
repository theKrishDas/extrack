import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "#/convex/_generated/api"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button/animated-button"
import { Spacer } from "@/components/ui/spacer"
import { wait } from "@/lib/utils"
import { Spinner } from "../loading/spinner"

export function OnboardingRecovery({
  onRecovered,
}: {
  onRecovered?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const retryOnboarding = useMutation(api.userOnboarding.retryOnboarding)

  async function handleRetryOnboarding() {
    if (loading) return
    setLoading(true)
    try {
      await Promise.all([retryOnboarding(), wait(1500)]) // Artificial delay of atleast 1500 ms
      onRecovered?.()
    } catch {
      toast.error("Setup failed, please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <span className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--ios-red)_8%,transparent)_0%,transparent_90%)]" />
      <Container
        as="section"
        className="relative flex flex-1 flex-col px-4 py-6"
      >
        <span className="my-24 mt-32 block font-black text-6xl text-[color-mix(in_oklch,var(--ios-red)_90%,var(--ios-yellow))] uppercase">
          Oops!
        </span>

        <h1 className="sr-only">Error: Account setup incomplete</h1>
        <p className="w-fit text-pretty pr-2 text-lg md:text-wrap">
          Your account wasn't fully set up. This usually fixes itself.{" "}
          <br className="hidden md:block" />
          Tap the button below to finish setup.
        </p>
        <Spacer className="h-8" />
        <Button
          className="disabled:opacity-90"
          color="gray"
          isDisabled={loading}
          onPress={handleRetryOnboarding}
        >
          {loading && <Spinner />}
          Finish setup
        </Button>
      </Container>
    </>
  )
}
