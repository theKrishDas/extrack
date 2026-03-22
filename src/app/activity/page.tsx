import { Suspense } from "react"
import { Container } from "@/components/layout/container"
import { Spinner } from "@/components/loading/spinner"
import {
  type QueryParamTabItem,
  QueryParamTabs,
} from "@/components/navigation/query-param-tabs"
import { TransactionContainer } from "./_comp/TransactionContainer"

const ACTIVITY_TYPE_TABS: QueryParamTabItem[] = [
  { id: "all", label: "All", value: null },
  { id: "expense", label: "Expense", value: "expense" },
  { id: "income", label: "Income", value: "income" },
]

export default function Page() {
  return (
    <main className="flex-1 px-4 md:px-0">
      <Container as="section" className="flex flex-col">
        <h1 className="sr-only">Activities</h1>
        <Suspense fallback={<Spinner className="mt-4 self-center" />}>
          <QueryParamTabs
            aria-label="Transaction type"
            className="mt-4 mb-4.5"
            items={ACTIVITY_TYPE_TABS}
            param="type"
          >
            <TransactionContainer />
          </QueryParamTabs>
        </Suspense>
      </Container>
    </main>
  )
}
