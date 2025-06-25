import {Dock} from "@/components/app/dock"
import {Summary} from "@/components/app/summary"
import {Container} from "@/components/layout/container"

export default function Home() {
  return (
    <>
      <Dock />

      {/* // WARN: this main container has a height */}
      <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
        <Container className="flex flex-col gap-0.5" as="section">
          <Summary />
        </Container>
      </main>
    </>
  )
}
