export function ListEndMessage({ visible }: { visible: boolean }) {
  if (!visible) return

  return (
    <div className="pointer-events-none flex h-48 w-full select-none items-center justify-center gap-1 pt-4 text-label-tertiary">
      <span className="font-rnx-rounded text-[1.2em]">􁜔</span>
      <p className="font-medium">End reached</p>
    </div>
  )
}
