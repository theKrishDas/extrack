import Image from "next/image"
import { DEVELOPER } from "#lib/config/developer"
import { cn } from "@/lib/utils"

export function DeveloperProfile() {
  const IMAGE_SIZE = 72

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "relative w-fit overflow-hidden outline-2 outline-separator-list-color",
          "supports-[corner-shape:squircle]:corner-squircle rounded-3xl supports-[corner-shape:squircle]:rounded-[3rem]"
        )}
      >
        <Image
          alt={`${DEVELOPER.name} avatar`}
          className="size-26 object-cover"
          height={IMAGE_SIZE}
          loader={({ src }) => src}
          src={DEVELOPER.avatar}
          width={IMAGE_SIZE}
        />
      </div>

      <h2 className="font-semibold text-2xl">{DEVELOPER.name}</h2>
    </div>
  )
}
