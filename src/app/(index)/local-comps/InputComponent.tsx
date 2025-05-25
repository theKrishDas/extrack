import {Input} from "react-aria-components"

import {Button} from "@/components/ui/button"
import {
  MatCloseRounded,
  MatRefreshRounded,
  MatUnfoldMoreRounded,
} from "@/components/icons/mat"

export default function InputComponent() {
  return (
    <div className="inline-flex w-full flex-col items-center">
      <Nav />
      <Input
        className="text-label-primary/90 h-62 w-full text-center text-5xl font-medium"
        name="amount-input"
        defaultValue="300"
        type="number"
      />
      <Input
        className="bg-fill-quaternary text-label-secondary w-full max-w-30 rounded-xl px-3 py-2 text-center text-sm leading-5.5 select-none"
        name="amount-input"
        placeholder="Add note"
        type="text"
      />

      <div className="mt-10 flex w-full justify-center">
        <Button variant="filled" color="blue">
          Save
        </Button>
      </div>
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
        <Button color="gray" size="sm" className="[&_svg]:-mr-1">
          Category
          <MatUnfoldMoreRounded />
        </Button>
        <Button color="gray" size="sm" isIconOnly variant="ghost" isDisabled>
          <MatRefreshRounded />
        </Button>
      </div>

      <Button color="gray" size="sm" isIconOnly variant="ghost" isDisabled>
        <MatCloseRounded />
      </Button>
    </div>
  )
}
