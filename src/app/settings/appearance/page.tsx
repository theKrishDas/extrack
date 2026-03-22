"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "react-aria-components"
import { Container } from "@/components/layout/container"
import { List } from "@/components/ui/list-v2"
import { Header } from "@/components/ui/navigation-header/header"
import { Spacer } from "@/components/ui/spacer"
import { cn } from "@/lib/utils"

const THEME_OPTIONS = [
  { label: "Auto", value: "system" },
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
] as const

export default function Page() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="flex-1 px-4" data-vaul-drawer-wrapper="">
      <Spacer className="h-4" />
      <Container as="section" className="flex flex-col gap-0.5">
        <Header href="/settings" title="Appearance" />
        <Spacer className="h-8" />

        <List.Root>
          <List.Header>
            <List.Text level="heading">Theme</List.Text>
          </List.Header>
          <List.Wrapper>
            <List.Item>
              <List.Content>
                <List.Trailing>
                  <List.Title>
                    <List.Text>Appearance mode</List.Text>
                  </List.Title>
                  <List.Accessories>
                    <div className="inline-flex items-center gap-1 rounded-[0.7rem] bg-fill-secondary p-0.5">
                      {THEME_OPTIONS.map((option) => (
                        <Button
                          className={cn(
                            "min-w-12 rounded-[0.5rem] px-2 py-1 font-semibold text-label-secondary text-xs transition-colors",
                            mounted &&
                              theme === option.value &&
                              "bg-background-primary-elevated text-label-primary"
                          )}
                          key={option.value}
                          onPress={() => setTheme(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </List.Accessories>
                </List.Trailing>
              </List.Content>
            </List.Item>
          </List.Wrapper>
        </List.Root>
      </Container>
    </main>
  )
}
