import {Button} from "@/components/ui/button/animated-button"
import {IonPencil} from "@/components/icons/ion"
import {Material} from "@/components/material/material"

import Fab from "../fab/MainFab"

export default function Dock() {
  return (
    <nav className="fixed inset-x-0 bottom-1.5 z-40 flex h-fit items-center justify-center gap-1 pb-6">
      <Material withBorder className="inline-flex items-center rounded-full">
        {Array.from({length: 3}, (_, idx) => (
          <Button key={idx} variant="ghost" color="gray" size="lg" isIconOnly>
            <IonPencil />
          </Button>
        ))}
      </Material>

      <Material withBorder className="rounded-full">
        <Fab />
      </Material>
    </nav>
  )
}
