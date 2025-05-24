import {Input} from "react-aria-components"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {MatCloseRounded, MatRefreshRounded} from "@/components/icons/mat"

export default function InputComponent() {
  return (
    <div className="inline-flex w-full flex-col items-center">
      <Nav />
      <Input
        className={cn(
          "text-label-primary/90 hidden h-30 w-full text-center text-5xl font-bold"
          // "w-full max-w-70 rounded-lg"
          // "px-3.5 py-1.75 leading-5",
          // "rounded-xl px-5 py-3.5 leading-5.5"
        )}
        name="amount-input"
        defaultValue="300"
        // type="number"
      />
    </div>
  )
}

const Nav = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="inline-flex items-center gap-1">
        <Button color="gray" size="sm">
          Today
        </Button>
        <Button
          color="gray"
          size="sm"
          isIconOnly
          className="leading-0! sm:leading-0!"
        >
          <MatRefreshRounded />
        </Button>
      </div>

      <Button
        color="gray"
        size="sm"
        isIconOnly
        className="leading-0! sm:leading-0!"
      >
        <MatCloseRounded />
      </Button>
    </div>
  )
}
