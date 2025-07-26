import {Spacer} from "@/components/ui/spacer"
import {Container} from "@/components/layout/container"

import AccountInfo from "./local-comps/AccountInfo"

export default async function Page({params}: {params: Promise<{id: string}>}) {
  const {id} = await params

  return (
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container
        className="relative flex flex-col gap-0.5"
        as="section"
        asChild
      >
        <AccountInfo id={id} />
      </Container>
    </main>
  )
}
