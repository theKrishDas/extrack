"use client"

import {CSSProperties} from "react"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"
import {Link} from "react-aria-components"

import {CURRENCY} from "@/lib/date-utils"
import {Button} from "@/components/ui/button/animated-button"
import {List} from "@/components/ui/list-v2"
import {Spacer} from "@/components/ui/spacer"
import {Container} from "@/components/layout/container"
import {Spinner} from "@/components/loading/spinner"

export default function Page() {
  const accounts = useQuery(api.accounts.getAll)
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

  if (!accounts) return <Spinner />

  const account = accounts[0]
  const fmtBalance = formatter.format(account.currentBalance)

  return (
    <>
      <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
        <Container className="flex flex-col gap-0.5" as="section">
          <div className="mb-4.5 flex items-center gap-2 pl-0.5">
            <Link
              href="/settings/accounts"
              className="data-pressed:bg-fill-tertiary text-ios-blue relative w-fit cursor-auto text-xl font-bold"
              style={
                {
                  WebkitUserDrag: "none",
                  userDrag: "none",
                  WebkitTouchCallout: "none",
                } as CSSProperties
              }
            >
              􀆉
              <span className="absolute -inset-x-1.5 inset-y-0" />
            </Link>
            <h3 className="sr-only text-2xl font-semibold tracking-tight">
              Account info
            </h3>
          </div>

          <div className="flex w-full flex-col items-center justify-center">
            <Button
              className="font-rnx-rounded size-32 overflow-hidden rounded-full text-6xl text-white sm:size-32 md:size-24 md:text-3xl"
              size="lg"
              color="gray"
              variant="tinted"
            >
              {/* {account.icon} */}
              🫵
            </Button>

            <p className="mt-2 text-2xl font-bold">{account.name}</p>
          </div>

          <Spacer className="h-6" />

          <List.Root>
            <List.Header>
              <List.Text level="heading">Name</List.Text>
            </List.Header>
            <List.Wrapper>
              <List.Item>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>{account.name}</List.Text>
                    </List.Title>
                  </List.Trailing>
                </List.Content>
              </List.Item>
            </List.Wrapper>

            <List.Header>
              <List.Text level="heading">Balance</List.Text>
            </List.Header>
            <List.Wrapper>
              <List.Item>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>{fmtBalance}</List.Text>
                    </List.Title>
                  </List.Trailing>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Currency</List.Text>
                    </List.Title>
                    <List.Accessories>
                      <List.Text level="3">Indian Rupee 􀆊</List.Text>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </List.Item>
            </List.Wrapper>

            <List.Header>
              <List.Text level="heading">Others</List.Text>
            </List.Header>
            <List.Wrapper>
              <List.Item>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Active</List.Text>
                    </List.Title>
                    <List.Accessories>
                      <List.Text className="text-ios-green">􀁣</List.Text>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Set as default</List.Text>
                    </List.Title>
                    <List.Accessories>
                      <List.Text level="3">􀁣</List.Text>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </List.Item>
            </List.Wrapper>

            <List.Header>
              <List.Text level="heading">Danger zone</List.Text>
            </List.Header>
            <List.Wrapper>
              <List.Item>
                <List.Image color="red">􀈒</List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Delete Account</List.Text>
                    </List.Title>
                  </List.Trailing>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Image color="yellow">􀑪</List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>Change balance</List.Text>
                    </List.Title>
                    <List.Accessories>
                      <List.Text level="3">􀆊</List.Text>
                    </List.Accessories>
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
