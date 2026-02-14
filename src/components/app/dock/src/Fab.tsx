import { motion } from "motion/react"
import type { Dispatch, SetStateAction } from "react"
import { IonPlusRound } from "@/components/icons/ion/add"
import { Button } from "@/components/ui/button/animated-button"

import { physics } from "./helpers"

export default function Fab({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Button
      className="backdrop-blur-3xl"
      color="gray"
      isIconOnly
      onPress={() => setOpen((v) => !v)}
      variant="gray"
    >
      <motion.span
        animate={open ? { rotate: 45 } : { rotate: 0 }}
        transition={physics}
      >
        <IonPlusRound />
      </motion.span>
    </Button>
  )
}
