import { Suspense } from "react"
import { Container } from "@/components/layout/container"
import { Spinner } from "@/components/loading/spinner"
import { PageHeader } from "@/components/navigation/page-header"
import CategoryListSection from "./_comps/CategoryListSection"
import { CategoryToolbar } from "./_comps/CategoryToolbar"

export default function Page() {
  return (
    <>
      <PageHeader
        backHref="/settings"
        margin={9}
        title="Category Settings"
        visuallyHidden
      />

      <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
        <Container as="section" className="flex flex-col">
          <Suspense fallback={<Spinner />}>
            <CategoryToolbar />
            <CategoryListSection />
          </Suspense>
        </Container>
      </main>
    </>
  )
}
