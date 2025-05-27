import {cn} from "@/lib/utils"

import {IonPencil} from "../icons/ion"
import {Button} from "../ui/button"
import Fab from "./fab/MainFab"

export default function Dock() {
  return (
    <nav className="fixed inset-x-0 bottom-1.5 z-40 flex h-fit items-center justify-center gap-1 pb-6">
      <div
        className={cn(
          "inline-flex items-center rounded-full",
          "bg-fill-quaternary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-[8px]" // Material
          // "bg-fill-quaternary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-2xl"
        )}
      >
        {Array.from({length: 3}, (_, idx) => (
          <Button key={idx} variant="ghost" color="gray" size="lg" isIconOnly>
            <IonPencil />
          </Button>
        ))}
      </div>

      <div
        className={cn(
          "rounded-full",
          "bg-fill-quaternary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-[8px]" // Material
          // "bg-fill-quaternary shadow-[inset_0_1px,inset_0_0_0_1px] shadow-white/[0.025] backdrop-blur-2xl"
        )}
      >
        <Fab />
      </div>
    </nav>
  )
}
