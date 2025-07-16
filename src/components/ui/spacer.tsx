import {cn} from "@/lib/utils"

export function Spacer({className}: {className: string}) {
  return <div className={cn("spacer h-3", className)} aria-hidden />
}
