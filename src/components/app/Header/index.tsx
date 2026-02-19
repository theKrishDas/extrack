import { Container } from "@/components/layout/container"
import { Spacer } from "@/components/ui/spacer"
import { SettingsButton } from "./SettingsButton"

export default function Header() {
  return (
    <Container asChild>
      <header>
        <nav className="flex px-4 py-3">
          <Spacer className="flex-1" />
          <div className="flex gap-3 text-3xl">
            <SettingsButton />
          </div>
        </nav>
      </header>
    </Container>
  )
}
