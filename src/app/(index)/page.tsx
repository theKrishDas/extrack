import Balance from "@/components/app/summary/Balance"
import { Container } from "@/components/layout/container"
import { Spacer } from "@/components/ui/spacer"
import { BalanceTrend } from "@/features/charts/BalanceTrend"
import { SpendingPace } from "@/features/charts/RemainingBalance"
import { WeeklyAverage } from "@/features/charts/WeeklyAverage"

export default function Home() {
  return (
    <main className="flex-1" data-vaul-drawer-wrapper="">
      <Container as="section" className="flex flex-col">
        <div className="mt-32 mb-26 grid place-content-center">
          <Balance />
        </div>
        <div className="px-4">
          <BalanceTrend />
          <Spacer className="h-12" />
          <SpendingPace />
          <SubHeading>Weekly Average</SubHeading>
          <WeeklyAverage />
        </div>
      </Container>

      <Spacer className="h-[24vh] w-full min-w-1" />
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
