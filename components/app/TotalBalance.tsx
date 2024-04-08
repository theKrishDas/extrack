import { getTotalBalance } from "@/actions/balance-querry";
import { formatCurrency } from "@/lib/utils";

export default async function TotalBalance({
  initialBalance,
}: {
  initialBalance: number;
}) {
  const { totalBalance, error } = await getTotalBalance(initialBalance);

  // TODO: Build custom components for following cases
  if (error) return <p>{error}</p>;

  const formattedBalance = formatCurrency(totalBalance || 0);

  return (
    <div className="flex w-full flex-col gap-8 rounded-md bg-foreground/90 p-4 text-background">
      <p className="font-light">Total balance</p>
      <p className="text-3xl">{formattedBalance}</p>
    </div>
  );
}
