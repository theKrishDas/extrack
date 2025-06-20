import {Container} from "@/components/layout/container"

import TransactionsList from "./local-comps/TransactionList"

export default function Page() {
  return (
    <>
      <Container className="flex flex-col gap-0.5" as="section">
        <div className="px-4">
          <h3 className="mt-4 mb-4.5 text-3xl font-semibold tracking-tight">
            Activities
          </h3>

          <TransactionsList />
        </div>
      </Container>
    </>
  )
}
