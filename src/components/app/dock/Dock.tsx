import {
  MatHistoryRounded,
  MatPlannerReviewRounded,
  MatSettingsOutlineRounded,
} from "@/components/icons/mat"
import {Material} from "@/components/material/material"

import Fab from "../fab/MainFab"
import Button from "./Button"

export default function Dock() {
  return (
    <nav className="fixed inset-x-0 bottom-1.5 z-40 flex h-fit items-center justify-center gap-1 pb-6">
      <Material withBorder className="inline-flex items-center rounded-full">
        <Button position="left">
          <MatPlannerReviewRounded />
        </Button>
        <Button position="center">
          <MatHistoryRounded />
        </Button>
        <Button position="right">
          <MatSettingsOutlineRounded />
        </Button>
      </Material>

      <Material withBorder className="rounded-full">
        <Fab />
      </Material>
    </nav>
  )
}
