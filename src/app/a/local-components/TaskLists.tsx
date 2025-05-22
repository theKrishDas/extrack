"use client"

import { api } from "#/convex/_generated/api"
import { useQuery } from "convex/react"

export default function TaskLists() {
  const tasks = useQuery(api.tasks.get)
  if (!tasks || tasks.length === 0) return <p>No tasks found!</p>

  return (
    <section className="flex h-fit gap-1">
      <ul className="bg-fill-quaternary flex flex-col rounded-lg p-1">
        {tasks.map(task => (
          <li
            className="hover:bg-fill-secondary flex gap-2 rounded px-2 py-1 text-sm font-medium select-none"
            key={task._id}
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              disabled
              readOnly
            />
            <span>{task.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
