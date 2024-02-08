import { getTotalBalance } from "@/actions/balance-querry";

export default async function TotalBalance() {
  const { totalBalance, error } = await getTotalBalance();

  // TODO: Build custom components for following cases
  if (error) return <p>{error}</p>;

  return <>{totalBalance}</>;
}
