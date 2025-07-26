import {Dispatch, SetStateAction} from "react"
import {useRouter} from "next/navigation"
import {AnimatePresence, motion, Variants} from "motion/react"
import {UseFormReturn} from "react-hook-form"

import {NewAccountSchemaType} from "@/lib/schema/accounts"
import {cn} from "@/lib/utils"
import {AnimatedContainer} from "@/components/ui/animated-container"
import {Button} from "@/components/ui/button/animated-button"

export function Header({
  editable,
  isEditing,
  setEditing,
  form,
  onSubmit,
}: {
  editable: boolean
  isEditing: boolean
  setEditing: Dispatch<SetStateAction<boolean>>
  form: UseFormReturn<NewAccountSchemaType>
  onSubmit: (_: NewAccountSchemaType) => void
}) {
  const router = useRouter()
  const href = "/settings/accounts" as const
  const variants: Variants = {
    initial: {filter: "blur(3px)", scale: 0, opacity: 0},
    animate: {filter: "blur(0px)", scale: 1, opacity: 1},
    exit: {filter: "blur(3px)", scale: 0, opacity: 0},
  }

  return (
    <header className="relative flex h-11 w-full items-center sm:h-9">
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <h1 className="sr-only">Account Details</h1>
      </div>

      <Button
        color="gray"
        className={cn(
          "absolute top-0 left-0 text-lg font-normal shadow-[0_0_12px] shadow-black/10 sm:text-base",
          "[--button-bg:var(--background)] [--button-highlight:var(--fill-primary)] dark:[--button-bg:var(--fill-quaternary)]"
        )}
        isIconOnly
        onPress={() => {
          if (isEditing) {
            setEditing(false)
            form.reset()
            return
          }
          router.push(href, {scroll: false})
        }}
      >
        <AnimatePresence key={isEditing ? "T" : "F"} mode="sync">
          {!isEditing ? (
            <motion.span
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              􀆉
            </motion.span>
          ) : (
            <motion.span
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              􀆄
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <Button
        size="sm"
        className="absolute top-0 right-0"
        variant={!isEditing ? "gray" : "filled"}
        onPress={() => {
          form.handleSubmit(onSubmit)()
          setEditing(v => !v)
        }}
        isDisabled={!editable}
        // TODO: Add this prop later
        // isPending={}
      >
        <AnimatedContainer.Root animate="width">
          <AnimatedContainer.Content
            animationKey={isEditing ? "T" : "F"}
            initial={{filter: "blur(3px)", opacity: 0}}
            animate={{filter: "blur(0px)", opacity: 1}}
            exit={{filter: "blur(3px)", opacity: 0}}
          >
            {!isEditing ? "Edit" : "Done"}
          </AnimatedContainer.Content>
        </AnimatedContainer.Root>
      </Button>
    </header>
  )
}
