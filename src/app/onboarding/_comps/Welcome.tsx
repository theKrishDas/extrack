import Image from "next/image"
import { Spacer } from "@/components/ui/spacer"

export function Welcome() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="grid h-full w-full flex-1 place-content-center">
          <Image
            alt="Extrack app icon"
            height={82}
            priority
            quality={100}
            src="/appicon.png"
            width={82}
          />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-bold text-2xl">Welcome to extrack</h1>
          <p className="text-label-secondary">Know where your money goes.</p>
        </div>
      </div>

      <Spacer className="h-12" />
    </>
  )
}
