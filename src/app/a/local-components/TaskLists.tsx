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
          const { _id: id, text, isCompleted } = task
          return (
            <li
              className="hover:bg-fill-secondary relative flex items-start gap-2 overflow-hidden rounded px-2 py-1 text-sm font-medium select-none"
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
              <button
                className="absolute inset-0"
                onClick={() => handleCompleteTask(id, !isCompleted)}
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
