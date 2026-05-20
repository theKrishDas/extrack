"use client"

import { useQuery } from "convex-helpers/react/cache"
import { api } from "#/convex/_generated/api"
import Balance from "@/components/app/summary/Balance"
import { Container } from "@/components/layout/container"
import { SplashScreen } from "@/components/loading/splash-screen"
import { Spacer } from "@/components/ui/spacer"
import ShinyText from "@/components/ui/text-shimmer"
import { BalanceTrend } from "@/features/charts/BalanceTrend"
import { SpendingPace } from "@/features/charts/RemainingBalance"
import { WeeklyAverage } from "@/features/charts/WeeklyAverage"

export default function Home() {
  const oldestTransaction = useQuery(api.transaction.list, {
    limit: 1,
    order: "asc",
  })

  if (oldestTransaction === undefined) return <SplashScreen />

  const hasTransactions = oldestTransaction.length > 0

  return (
    <main className="flex flex-1 flex-col" data-vaul-drawer-wrapper="">
      <Container as="section" className="flex flex-1 flex-col">
        <Spacer className="h-32" />
        <div className="place-content-center">
          <Balance showDelta={hasTransactions} />
        </div>

        {hasTransactions ? (
          <div className="mt-26 px-4">
            <Spacer className="h-6" />
            <BalanceTrend />
            <Spacer className="h-12" />
            <SpendingPace />
            <SubHeading>Weekly Average</SubHeading>
            <WeeklyAverage />
            <Spacer className="h-[24vh] w-full min-w-1" />
          </div>
        ) : (
          <NoActivity />
        )}
      </Container>
    </main>
  )
}

const SubHeading = ({ ...props }: React.ComponentProps<"p">) => {
  return (
    <p
      className="mt-4 w-fit px-4 text-label-secondary text-lg leading-12"
      {...props}
    />
  )
}

const NoActivity = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center pb-4 text-center font-medium text-label-secondary text-lg">
      <ShinyText
        ariaLabel="Press plus button to add a transaction"
        delay={2}
        direction="left"
        shineColor="var(--label-primary)"
        speed={2}
        spread={65}
        text="Press 􀁍 to add a transaction"
      />
    </div>
  )
}
