export default function EmptyTransaction() {
  return (
    <div className="pointer-events-none flex h-52 touch-none select-none items-center justify-center rounded-md bg-muted/40">
      <p className="text-sm font-semibold text-muted-foreground/40">
        No transaction yet!
      </p>
    </div>
  );
}
