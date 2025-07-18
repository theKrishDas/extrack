import {ReactNode} from "react"
import {usePathname, useRouter} from "next/navigation"

import {Button} from "@/components/ui/button/animated-button"

const IdleNav = () => {
  return (
    <div className="flex gap-0.5">
      <NavButton url="/">􀑰 Summary</NavButton>
      <NavButton url="/activity">􀄬 Transactions</NavButton>
    </div>
  )
}

function NavButton({children, url}: {children: ReactNode; url: string}) {
  const router = useRouter()
  const pathname = usePathname().trim()

  function navigate(url: string) {
    if (url === pathname) return
    router.push(url)
  }
  return (
    <Button
      color={pathname === url ? "blue" : "gray"}
      variant={pathname === url ? "gray" : "ghost"}
      onPress={() => navigate(url)}
    >
      {children}
    </Button>
  )
}

export default IdleNav
