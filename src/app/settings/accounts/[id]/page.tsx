"use client"

import {useParams} from "next/navigation"
import {api} from "#/convex/_generated/api"
import {Id} from "#/convex/_generated/dataModel"
import {useQuery} from "convex/react"

import {Header} from "@/components/ui/navigation-header/header"
import {Spacer} from "@/components/ui/spacer"
import {Container} from "@/components/layout/container"
import {Spinner} from "@/components/loading/spinner"

import {AccountInfo} from "../../local-comps/AccountInfo"

export default function Page() {
  const params = useParams()
  const allAccounts = useQuery(api.accounts.getAll)

  const id = (params.id as Id<"accounts">) || null
  const account = allAccounts?.find(acc => acc._id === id) ?? null

  return (
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container className="relative flex flex-col gap-0.5" as="section">
        <Header title="Account Info" href="/settings/accounts" srOnly />

        <Spacer className="h-8" />

        {allAccounts ? (
          account ? (
            <AccountInfo account={account} />
          ) : (
            <p>Nada!</p>
          )
        ) : (
          <Spinner />
        )}
      </Container>
    </main>
  )
}
