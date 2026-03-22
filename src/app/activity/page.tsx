import { Suspense } from "react"
import { Container } from "@/components/layout/container"
import { Spinner } from "@/components/loading/spinner"
import { ActivityTransactionTypeTabs } from "./_comp/ActivityTransactionTypeTabs"
import { TransactionContainer } from "./_comp/TransactionContainer"

export default function Page() {
  return (
    <main className="flex-1 px-4 md:px-0">
      <Container as="section" className="flex flex-col">
        <h1 className="sr-only">Activities</h1>
        <Suspense fallback={<Spinner className="mt-4" />}>
          <ActivityTransactionTypeTabs>
            <TransactionContainer />
          </ActivityTransactionTypeTabs>
        </Suspense>
      </Container>
    </main>
  )
}
