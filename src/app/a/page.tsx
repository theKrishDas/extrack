import { cn } from "@/lib/utils"

import AddTasks from "./local-components/AddTasks"
import TaskLists from "./local-components/TaskLists"
import UserButton from "./local-components/user-button"

export default function Page() {
  return (
    <>
      <UserButton />

      <main className="px-6 py-4">
        <AddTasks />

        <Spacer className="h-4" />

        <TaskLists />
      </main>
    </>
  )
}

const Spacer = ({ className }: { className: string }) => {
  return <div className={cn("h-4 w-full", className)} aria-hidden />
}
