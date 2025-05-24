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
          "text-label-primary/90 h-62 w-full text-center text-5xl font-medium"
          // "w-full max-w-70 rounded-lg"
          // "px-3.5 py-1.75 leading-5",
          // "rounded-xl px-5 py-3.5 leading-5.5"
        )}
        name="amount-input"
        defaultValue="300"
        // type="number"
      />
      <Input
        className={cn(
          "text-label-secondary bg-fill-tertiary inline-flex h-12 w-25 items-center justify-center rounded-full px-5 text-center text-base leading-none font-medium tracking-[0.01em] sm:h-9 sm:px-3 sm:text-sm"
          // "w-full max-w-70 rounded-lg"
          // "px-3.5 py-1.75 leading-5",
          // "rounded-xl px-5 py-3.5 leading-5.5"
        )}
        name="amount-input"
        placeholder="Add note"
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
