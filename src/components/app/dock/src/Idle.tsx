import {useRouter} from "next/navigation"
import {Icon} from "@iconify/react"

import {Button} from "@/components/ui/button/animated-button"

const IdleNav = () => {
  const router = useRouter()

  return (
    <div className="flex gap-1">
      <Button color="gray" onPress={() => router.push("/")}>
        Home
      </Button>
      <Button color="gray" onPress={() => router.push("/activity")}>
        <Icon icon="material-symbols:moving" />
        Activity
      </Button>
    </div>
  )
}

export default IdleNav
