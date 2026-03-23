"use client"

import type { CSSProperties } from "react"
import { Button, Link } from "react-aria-components"
import { Container } from "@/components/layout/container"
import { List } from "@/components/ui/list-v2"

export default function Page() {
  return (
    <main className="flex-1 px-4 pt-6" data-vaul-drawer-wrapper="">
      <Container as="section" className="flex flex-col gap-0.5">
        <h3 className="mt-4 mb-4.5 pl-4 font-semibold text-3xl tracking-tight">
          Settings
        </h3>

        <List.Root>
          <List.Header>
            <List.Text level="heading">{"Accounts & Categories"}</List.Text>
          </List.Header>
          <List.Wrapper>
            <List.Item asChild>
              <Link
                className="cursor-auto data-pressed:bg-fill-tertiary"
                href="/settings/accounts"
                style={
                  {
                    WebkitUserDrag: "none",
                    userDrag: "none",
                    WebkitTouchCallout: "none",
                  } as CSSProperties
                }
              >
                <List.Image color="red">
                  <Icon>􀑇</Icon>
                </List.Image>
                <List.Content className="pointer-events-none">
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Accounts</List.Text>
                    </List.Title>

                    <List.Accessories>
                      <Button className="inline-flex h-full items-center justify-end gap-1 font-semibold text-label-secondary">
                        􀆊
                      </Button>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </Link>
            </List.Item>

            <List.Item asChild>
              <Link
                className="cursor-auto data-pressed:bg-fill-tertiary"
                href="/settings/categories"
                style={
                  {
                    WebkitUserDrag: "none",
                    userDrag: "none",
                    WebkitTouchCallout: "none",
                  } as CSSProperties
                }
              >
                <List.Image color="yellow">
                  <Icon>􀏪</Icon>
                </List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Categories</List.Text>
                    </List.Title>

                    <List.Accessories>
                      <Button className="inline-flex h-full items-center justify-end gap-1 font-semibold text-label-secondary">
                        􀆊
                      </Button>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </Link>
            </List.Item>
          </List.Wrapper>
        </List.Root>

        <List.Root>
          <List.Header>
            <List.Text level="heading">Appearance</List.Text>
          </List.Header>
          <List.Wrapper>
            <List.Item asChild>
              <Link
                className="cursor-auto data-pressed:bg-fill-tertiary"
                href="/settings/appearance"
                style={
                  {
                    WebkitUserDrag: "none",
                    userDrag: "none",
                    WebkitTouchCallout: "none",
                  } as CSSProperties
                }
              >
                <List.Image color="indigo">
                  <Icon>􀆸</Icon>
                </List.Image>
                <List.Content className="pointer-events-none">
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Theme</List.Text>
                    </List.Title>

                    <List.Accessories>
                      <Button className="inline-flex h-full items-center justify-end gap-1 font-semibold text-label-secondary">
                        􀆊
                      </Button>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </Link>
            </List.Item>
          </List.Wrapper>
        </List.Root>
      </Container>
    </main>
  )
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-grid size-7 place-content-center overflow-hidden rounded-[0.55rem] bg-[var(--list-image-color)] text-sm">
      <span className="text-white/85 mix-blend-plus-lighter">{children}</span>
    </div>
  )
}
