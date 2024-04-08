import InitialBalancePrompt from "@/components/initialBalance/InitialBalancePrompt";
import TotalBalance from "@/components/app/TotalBalance";
import { getInitialBalance } from "@/actions/balance-querry";

export default async function BalanceDisplay() {
  const { initialBalance, error } = await getInitialBalance();

  // TODO: Build components for this
  if (error) return <p>{error}</p>;

  if (initialBalance === undefined)
    return <p>Unable to fetch starting balance!</p>;

  return (
    <>
      <InitialBalancePrompt initialBalance={initialBalance} />
      <TotalBalance initialBalance={initialBalance} />
    </>
  );
}
