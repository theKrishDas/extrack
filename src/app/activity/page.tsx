import { Container } from "@/components/layout/container"
import { TransactionList } from "./local-comps/transaction-list"

export default function Page() {
  return (
    <Container as="section" className="flex flex-col gap-0.5">
      <div className="px-4">
        <h3 className="mt-4 mb-4.5 font-semibold text-3xl tracking-tight">
          Activities
        </h3>

        <TransactionList />
      </div>
    </Container>
  )
}
