import { Container } from "@/components/layout/container"
import { Spacer } from "@/components/ui/spacer"
import AccountInfo from "./local-comps/AccountInfo"

export const dynamic = "force-static"

export default function Page() {
  return (
    <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="relative flex flex-col gap-0.5">
        <AccountInfo />
      </Container>
    </main>
  )
}
