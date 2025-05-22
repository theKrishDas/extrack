import { ReactNode } from "react"

import { cn } from "@/lib/utils"

import AddCategory from "./local-components/AddCategory"
import AddTasks from "./local-components/AddTasks"
import CategoryLists from "./local-components/CategoryLists"
import TaskLists from "./local-components/TaskLists"
import UserButton from "./local-components/user-button"

export default function Page() {
  return (
    <>
      <UserButton />

      <main className="px-6 py-4">
        <div className="relative mx-auto flex w-full max-w-2xl grid-cols-2 flex-col gap-2 md:grid md:gap-6">
          <section className="h-fit w-full">
            <Heading>Tasks</Heading>
            <AddTasks />
            <Spacer />
            <TaskLists />
          </section>
          <Separator />

          <Spacer className="md:hidden" />

          <section className="h-fit w-full">
            <Heading>Categories</Heading>
            <AddCategory />
            <Spacer />
            <CategoryLists />
          </section>
        </div>
      </main>
    </>
  )
}

const Heading = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <h3 className={cn("mb-3 text-sm font-medium", className)}>{children}</h3>
  )
}

const Spacer = ({ className }: { className?: string }) => {
  return <div className={cn("h-4 w-full", className)} aria-hidden />
}
const Separator = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "bg-separator-non-opaque absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 rounded-full md:block",
        className
      )}
      aria-hidden
    />
  )
}
