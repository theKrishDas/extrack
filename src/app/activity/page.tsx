import { Container } from "@/components/layout/container"
import { TransactionContainer } from "./_comp/TransactionContainer"

export default function Page() {
  return (
    <main className="flex-1 px-4 md:px-0">
      <Container as="section" className="flex flex-col">
        <h3 className="mt-4 mb-4.5 font-semibold text-3xl tracking-tight">
          Activities
        </h3>

        <TransactionContainer />
      </Container>
    </main>
  )
}
