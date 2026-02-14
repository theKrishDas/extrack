export default function Summary() {
  return (
    <div className="flex h-40 w-full flex-col text-center">
      <p className="mt-5 font-bold text-base text-label-tertiary leading-8">
        Spent so far
      </p>
      <p className="-ml-2 font-bold text-5xl leading-none">
        <sup className="text-2xl">$</sup>
        6,258
      </p>
    </div>
  )
}
