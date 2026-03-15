import { AnimatePresence, motion, type Variants } from "motion/react"
import { useRouter } from "next/navigation"
import type { Dispatch, SetStateAction } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { UpdateAccountSchemaType } from "#lib/schema"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { Button } from "@/components/ui/button/animated-button"
import { cn } from "@/lib/utils"

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
  form: UseFormReturn<UpdateAccountSchemaType>
  onSubmit: (_: UpdateAccountSchemaType) => void
}) {
  const router = useRouter()
  const href = "/settings/accounts" as const
  const variants: Variants = {
    initial: { filter: "blur(3px)", scale: 0, opacity: 0 },
    animate: { filter: "blur(0px)", scale: 1, opacity: 1 },
    exit: { filter: "blur(3px)", scale: 0, opacity: 0 },
  }

  return (
    <header className="relative flex h-11 w-full items-center sm:h-9">
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <h1 className="sr-only">Account Details</h1>
      </div>

      <Button
        className={cn(
          "absolute top-0 left-0 font-normal text-lg shadow-[0_0_12px] shadow-black/10 sm:text-base",
          "[--button-bg:var(--background)] [--button-highlight:var(--fill-primary)] dark:[--button-bg:var(--fill-quaternary)]"
        )}
        color="gray"
        isIconOnly
        onPress={() => {
          if (isEditing) {
            setEditing(false)
            form.reset()
            return
          }
          router.push(href, { scroll: false })
        }}
      >
        <AnimatePresence key={isEditing ? "T" : "F"} mode="sync">
          {isEditing ? (
            <motion.span
              animate="animate"
              exit="exit"
              initial="initial"
              variants={variants}
            >
              􀆄
            </motion.span>
          ) : (
            <motion.span
              animate="animate"
              exit="exit"
              initial="initial"
              variants={variants}
            >
              􀆉
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <Button
        className="absolute top-0 right-0"
        isDisabled={!editable}
        onPress={() => {
          form.handleSubmit(onSubmit)()
          setEditing((v) => !v)
        }}
        size="sm"
        variant={isEditing ? "filled" : "gray"}
        // TODO: Add this prop later
        // isPending={}
      >
        <AnimatedContainer.Root animate="width">
          <AnimatedContainer.Content
            animate={{ filter: "blur(0px)", opacity: 1 }}
            animationKey={isEditing ? "T" : "F"}
            exit={{ filter: "blur(3px)", opacity: 0 }}
            initial={{ filter: "blur(3px)", opacity: 0 }}
          >
            {isEditing ? "Done" : "Edit"}
          </AnimatedContainer.Content>
        </AnimatedContainer.Root>
      </Button>
    </header>
  )
}
