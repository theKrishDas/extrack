export default function Summary() {
  return (
    <div className="flex h-40 w-full flex-col text-center">
      <p className="text-label-tertiary mt-5 text-base leading-8 font-bold">
        Spent so far
      </p>
      <p className="-ml-2 text-5xl leading-none font-bold">
        <sup className="text-2xl">$</sup>
        6,258
      </p>
    </div>
  )
}
