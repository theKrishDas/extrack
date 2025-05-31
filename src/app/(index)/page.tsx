import {Button} from "@/components/ui/button/animated-button"
import {Dock} from "@/components/app/dock-v2"
import Summary from "@/components/app/Summary"
import {IonChevronForward} from "@/components/icons/ion"
import {Container} from "@/components/layout/container"

import Transactions from "./local-comps/Transactions"

export default function Home() {
  return (
    <>
      <Dock />

      {/* // WARN: this main container has a height */}
      <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
        <Container className="flex flex-col gap-0.5" as="section">
          <Summary />
        </Container>

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
