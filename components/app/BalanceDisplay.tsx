import InitialBalancePrompt from "@/components/initialBalance/InitialBalancePrompt";
import TotalBalance from "@/components/app/TotalBalance";

export default async function BalanceDisplay() {
  const { initialBalance } = await import("@/actions/balance-querry").then(
    (_) => _.getInitialBalance(),
  );

  console.log("Initial Balance: ", initialBalance);
  return (
    <>
      <InitialBalancePrompt />
      <TotalBalance />
    </>
  );
}
