import {Button} from "@/components/ui/button/animated-button"
import {IonChevronForward} from "@/components/icons/ion"
import {Container} from "@/components/layout/container"

import ChildComponent from "./local-comps/ChildComponent"
import Transactions from "./local-comps/Transactions"

export default function Home() {
  return (
    <>
      <nav className="fixed inset-x-0 bottom-1/5 inline-flex items-center justify-center">
        <div className="inline-flex w-full max-w-md justify-center">
          <ChildComponent />
        </div>
      </nav>

      {/* // WARN: this main container has a height */}
      <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
        <Container className="flex flex-col gap-0.5" as="section">
          <div className="">
            <h3 className="sr-only">Recent transactions</h3>
            <Button variant="ghost" color="gray">
              All transactions
              <IonChevronForward />
            </Button>
          </div>
          <Transactions />
        </Container>
      </main>
    </>
  )
}
