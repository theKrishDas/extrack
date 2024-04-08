import InitialBalancePrompt from "@/components/initialBalance/InitialBalancePrompt";
import TotalBalance from "@/components/app/TotalBalance";

export default async function BalanceDisplay() {
  const { initialBalance } = await import("@/actions/balance-querry").then(
    (_) => _.getInitialBalance(),
  );

  // TODO: Build component for this
  if (initialBalance === undefined)
    return <p>Unable to fetch starting balance!</p>;

  return (
    <>
      <InitialBalancePrompt initialBalance={initialBalance} />
      <TotalBalance />
    </>
  );
}
