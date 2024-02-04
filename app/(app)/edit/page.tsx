export default function AddTransactionPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return <>{searchParams.id}</>;
}
