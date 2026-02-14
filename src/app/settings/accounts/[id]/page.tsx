import { Container } from "@/components/layout/container"
import { Spacer } from "@/components/ui/spacer"

import AccountInfo from "./local-comps/AccountInfo"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="relative flex flex-col gap-0.5">
        <AccountInfo id={id} />
      </Container>
    </main>
  )
}
