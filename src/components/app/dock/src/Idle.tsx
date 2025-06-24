import {useRouter} from "next/navigation"
import {FiActivity} from "react-icons/fi"

import {Button} from "@/components/ui/button/animated-button"

const IdleNav = () => {
  const router = useRouter()

  return (
    <div className="flex gap-1">
      <Button color="gray" onPress={() => router.push("/")}>
        Home
      </Button>
      <Button color="gray" onPress={() => router.push("/activity")}>
        <FiActivity strokeWidth={1.8} />
        Activity
      </Button>
    </div>
  )
}

export default IdleNav
