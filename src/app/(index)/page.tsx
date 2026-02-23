import { Summary } from "@/components/app/summary"
import Balance from "@/components/app/summary/Balance"
import { Container } from "@/components/layout/container"

export default function Home() {
  return (
    <main className="flex-1 px-4 pt-6" data-vaul-drawer-wrapper="">
      <Container as="section" className="flex flex-col gap-0.5">
        <Balance />
      </Container>

      <Container as="section" className="flex flex-col gap-0.5">
        <Summary />
      </Container>
    </main>
  )
}
