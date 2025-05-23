"use client"

import { api } from "#/convex/_generated/api"
import { Id } from "#/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"

import { cn } from "@/lib/utils"

export default function TaskLists() {
  const tasks = useQuery(api.tasks.get)
  const updateTask = useMutation(api.tasks.updateTask)

  if (!tasks || tasks.length === 0) return <p>No tasks found!</p>

  const handleCompleteTask = (id: Id<"tasks">, isCompleted: boolean): void => {
    updateTask({ id, isCompleted })
    return
  }

  return (
    <section className="flex h-fit gap-1">
      <ul className="bg-fill-quaternary flex flex-col rounded-lg p-1">
        {tasks.map(task => {
          const { _id: id, text, isCompleted, category } = task

          return (
            <li
              className="hover:bg-fill-secondary group relative flex items-start gap-2 overflow-hidden rounded px-2 py-1 text-sm font-medium select-none"
              key={id}
            >
              <input
                className="pointer-events-none my-1 touch-none"
                type="checkbox"
                checked={isCompleted}
                disabled
                readOnly
              />
              <span
                className={cn(
                  isCompleted && "text-label-tertiary line-through",
                  "pointer-events-none touch-none"
                )}
              >
                {text}
              </span>

              {category && (
                <div className="absolute top-0 right-0">
                  <span className="text-label-secondary bg-fill-tertiary rounded-md px-[0.2rem] py-0.5 text-xs">
                    {category}
                  </span>
                </div>
              )}

              <button
                className="absolute inset-0 z-10 hidden"
                onClick={() => handleCompleteTask(id, !isCompleted)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
