import {CSSProperties} from "react"
import {Icon} from "@iconify/react/dist/iconify.js"
import NumberFlow from "@number-flow/react"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {useQuery} from "convex/react"
import {Button} from "react-aria-components"

import {CURRENCY} from "@/lib/date-utils"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {List} from "@/components/ui/list-v2"
import {Form} from "@/components/form/account/new"
import {Spinner} from "@/components/loading/spinner"

export function Accounts() {
  const accounts = useQuery(api.accounts.getAll)
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })

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
          {accounts.map(account => {
            const {_id: id, currentBalance} = account
            const fmtBalance = formatter.format(currentBalance)

            return (
              <List.Item key={id}>
                <List.Image>
                  <Icon icon={account.icon} />
                </List.Image>
                <List.Content>
                  <List.Trailing>
                    <List.Title>
                      <List.Text>{account.name}</List.Text>
                      {/* TODO: add total number of transactions */}
                      <p className="bg-fill-tertiary text-label-secondary rounded-full px-1.5 text-sm leading-6 font-medium">
                        {Math.abs(account.currentBalance)}
                      </p>
                    </List.Title>
                    <List.Accessories>
                      <List.Text level="3">{fmtBalance}</List.Text>
                    </List.Accessories>
                  </List.Trailing>
                </List.Content>
              </List.Item>
            )
          })}

          <Drawer.Root showHandle>
            <List.Item asChild>
              <Drawer.Trigger asChild>
                <Button className="data-pressed:bg-fill-tertiary data-pressed:[&_[role='separator']]:bg-fill-opaque">
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
                </Button>
              </Drawer.Trigger>
            </List.Item>

            <Drawer.Content>
              <Drawer.Header className="sr-only">
                <Drawer.Title srOnly>New Account</Drawer.Title>
              </Drawer.Header>

              <Form />
            </Drawer.Content>
          </Drawer.Root>
        </List.Wrapper>
      </List.Root>
    </>
  )
}
