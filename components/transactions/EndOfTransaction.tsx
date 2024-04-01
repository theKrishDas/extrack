export default function EndOfTransaction() {
  return (
    <div className="pointer-events-none grid h-48 cursor-none select-none place-content-center">
      <p className="font-bold leading-tight text-muted-foreground/30">
        No more transactions.
      </p>
    </div>
  );
}
