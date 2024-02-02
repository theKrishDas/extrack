export default function TransactionDetail({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  return (
    <>
      <pre className="overflow-x-scroll rounded-lg bg-secondary p-3">
        {JSON.stringify(transaction, null, 2)}
      </pre>
    </>
  );
}
