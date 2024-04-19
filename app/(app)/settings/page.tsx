import InitialBalanceSettings from "@/components/settings/InitialBalanceSettings";
import { getInitialBalance } from "@/actions/balance-querry";

export default async function SettingsPage() {
  const { initialBalance, error } = await getInitialBalance();

  // TODO: Build components for this
  if (error) return <p>{error}</p>;

  if (initialBalance === undefined)
    return <p>Unable to fetch starting balance!</p>;

  return (
    <>
      <h1 className="pt-12 text-5xl font-light tracking-tight">Settings</h1>
      <InitialBalanceSettings initialBalance={initialBalance} />
    </>
  );
}
