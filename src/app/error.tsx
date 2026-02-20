/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: NextJS pneumonic: must be called Error */
"use client"

import { useEffect } from "react"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button/animated-button"
import { Spacer } from "@/components/ui/spacer"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex-1 px-4 pt-6">
      <h2 className="font-semibold text-xl leading-loose">
        Something went wrong!
      </h2>

      <Button onClick={() => reset()}>Try again</Button>
      <Spacer className="block h-12" />

      <pre className="corner-squircle max-w-full overflow-x-auto rounded-2xl bg-fill-secondary p-2 font-geist-mono text-sm">
        <code>{JSON.stringify(error, null, 2)}</code>
      </pre>
    </Container>
  )
}
