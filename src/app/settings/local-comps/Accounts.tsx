import {CSSProperties, useState} from "react"
import {Icon} from "@iconify/react/dist/iconify.js"
import NumberFlow from "@number-flow/react"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useQuery} from "convex/react"
import {Button as RacButton} from "react-aria-components"

import {CURRENCY} from "@/lib/date-utils"
import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {List} from "@/components/ui/list-v2"
import {Spacer} from "@/components/ui/spacer"
import {Form} from "@/components/form/account/new"
import {Spinner} from "@/components/loading/spinner"

export function Accounts() {
  const accounts = useQuery(api.accounts.getAll)

  if (!accounts) return <Spinner />

  const totalBalance = accounts.reduce((acc, v) => acc + v.currentBalance, 0)

  return (
    <>
      <div className="flex h-52 flex-col items-center justify-center pb-5 text-center">
        <NumberFlow
          className="text-5xl font-bold"
          style={{"--number-flow-char-height": "1.2ch"} as CSSProperties}
          format={{
            style: "currency",
            currency: CURRENCY,
            trailingZeroDisplay: "stripIfInteger",
          }}
          value={totalBalance}
        />
      </div>

      <List.Root>
        <List.Wrapper>
          {accounts.map(account => (
            <AccountItems account={account} key={account._id} />
          ))}

          <NewAccountDrawer />
        </List.Wrapper>
      </List.Root>
    </>
  )
}

function AccountItems({account}: {account: Doc<"accounts">}) {
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })
  const fmtBalance = formatter.format(account.currentBalance)

  return (
    <>
      <Drawer.Root key={account._id} showHandle>
        <List.Item asChild>
          <Drawer.Trigger asChild>
            <RacButton className="data-pressed:bg-fill-tertiary data-pressed:[&_[role='separator']]:bg-fill-opaque">
              <List.Image>
                <Icon icon={account.icon} />
              </List.Image>
              <List.Content>
                <List.Trailing>
                  <List.Title>
                    <List.Text>{account.name}</List.Text>
                    <p className="bg-fill-tertiary text-label-secondary rounded-full px-1.5 text-sm leading-6 font-medium">
                      {Math.abs(account.currentBalance)}
                    </p>
                  </List.Title>
                  <List.Accessories>
                    <List.Text level="3">{fmtBalance}</List.Text>
                  </List.Accessories>
                </List.Trailing>
              </List.Content>
            </RacButton>
          </Drawer.Trigger>
        </List.Item>

        <Drawer.Content className="h-full">
          <div className="h-full overflow-y-auto">
            <Drawer.Header>
              <Drawer.Title srOnly>Account</Drawer.Title>
            </Drawer.Header>

            <div className="inline-grid w-full place-content-center">
              <Button
                className="font-rnx-rounded size-32 overflow-hidden rounded-3xl text-6xl text-white sm:size-32 md:size-24 md:text-3xl"
                size="lg"
                color="gray"
                variant="tinted"
              >
                {/* {account.icon} */}
                🫵
              </Button>
            </div>

            <List.Root className="px-4">
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
                        <List.Text>Default</List.Text>
                      </List.Title>
                      <List.Accessories>
                        <List.Text level="3">􀁣</List.Text>
                      </List.Accessories>
                    </List.Trailing>
                  </List.Content>
                </List.Item>

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
              </List.Wrapper>
            </List.Root>

            <Spacer className="h-4" />
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}

function NewAccountDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer.Root showHandle open={open} onOpenChange={setOpen}>
      <List.Item asChild>
        <Drawer.Trigger asChild>
          <RacButton className="data-pressed:bg-fill-tertiary data-pressed:[&_[role='separator']]:bg-fill-opaque">
            <List.Image color="blue">􀅼</List.Image>
            <List.Content>
              <List.Trailing>
                <List.Title>
                  <List.Text className="text-ios-blue">
                    Add new account
                  </List.Text>
                </List.Title>
              </List.Trailing>
            </List.Content>
          </RacButton>
        </Drawer.Trigger>
      </List.Item>

      <Drawer.Content className="h-full">
        <Drawer.Header className="sr-only">
          <Drawer.Title srOnly>New Account</Drawer.Title>
        </Drawer.Header>

        <Form afterSumbmit={() => setOpen(false)} />
      </Drawer.Content>
    </Drawer.Root>
  )
}
