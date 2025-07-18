import {Dispatch, SetStateAction} from "react"
import {motion} from "motion/react"

import {Button} from "@/components/ui/button/animated-button"
import {IonPlusRound} from "@/components/icons/ion/add"

import {physics} from "./helpers"

export default function Fab({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Button
      color="gray"
      variant="gray"
      isIconOnly
      onPress={() => setOpen(v => !v)}
      className="backdrop-blur-3xl"
    >
      <motion.span
        animate={open ? {rotate: 45} : {rotate: 0}}
        transition={physics}
      >
        <IonPlusRound />
      </motion.span>
    </Button>
  )
}
