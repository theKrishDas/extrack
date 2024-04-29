import { getInitialBalance } from "@/actions/balance-querry";
import InitialBalanceSettings from "@/components/settings/InitialBalanceSettings";

export default async function StartingBalanceSettingsPage() {
  const { initialBalance, error } = await getInitialBalance();

  // TODO: Build components for this
  if (error) return <p>{error}</p>;

  if (initialBalance === undefined)
    return <p>Unable to fetch starting balance!</p>;
  return (
    <>
      <InitialBalanceSettings initialBalance={initialBalance} />
    </>
  );
}
