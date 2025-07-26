"use client"

import {CSSProperties} from "react"
import {Button, Link} from "react-aria-components"

import {List} from "@/components/ui/list-v2"
import {Dock} from "@/components/app/dock"
import {Container} from "@/components/layout/container"

export default function Page() {
  return (
    <>
      <Dock />

      {/* // WARN: this main container has a height */}
      <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
        <Container className="flex flex-col gap-0.5" as="section">
          <h3 className="mt-4 mb-4.5 pl-4 text-3xl font-semibold tracking-tight">
            Settings
          </h3>

          <List.Root>
            <List.Header>
              <List.Text level="heading">{"Accounts & Categories"}</List.Text>
            </List.Header>
            <List.Wrapper>
              <List.Item asChild>
                <Link
                  href="/settings/accounts"
                  className="data-pressed:bg-fill-tertiary cursor-auto"
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
                        <Button className="text-label-secondary inline-flex h-full items-center justify-end gap-1 font-semibold">
                          􀆊
                        </Button>
                      </List.Accessories>
                    </List.Trailing>
                  </List.Content>
                </Link>
              </List.Item>

              <List.Item asChild>
                <Link
                  href="/settings/categories"
                  className="data-pressed:bg-fill-tertiary cursor-auto"
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
                        <Button className="text-label-secondary inline-flex h-full items-center justify-end gap-1 font-semibold">
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
              <List.Text level="heading">{"Data & Backup"}</List.Text>
            </List.Header>
            <List.Wrapper>
              <List.Item>
                <List.Image color="green">
                  <Icon>􀌖</Icon>
                </List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Import data</List.Text>
                    </List.Title>
                  </List.Trailing>
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Image color="blue">
                  <Icon>􀌘</Icon>
                </List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Export data</List.Text>
                    </List.Title>
                  </List.Trailing>
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Image color="yellow">
                  <Icon>􀙸</Icon>
                </List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Backup your data</List.Text>
                    </List.Title>
                  </List.Trailing>
                </List.Content>
              </List.Item>
            </List.Wrapper>
          </List.Root>
        </Container>
      </main>
    </>
  )
}

function Icon({children}: {children: React.ReactNode}) {
  return (
    <div className="inline-grid size-7 place-content-center overflow-hidden rounded-[0.55rem] bg-[var(--list-image-color)] text-sm">
      <span className="text-white/85 mix-blend-plus-lighter">{children}</span>
    </div>
  )
}
