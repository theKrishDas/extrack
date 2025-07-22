import {CSSProperties, useState} from "react"
import {Icon} from "@iconify/react/dist/iconify.js"
import NumberFlow from "@number-flow/react"
import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useQuery} from "convex/react"
import {Link, Button as RacButton} from "react-aria-components"

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
  // const slug = account.name.toLowerCase()
  const slug = "id"

  return (
    <>
      <List.Item asChild>
        <Link
          href={`/settings/accounts/${slug}`}
          className="data-pressed:bg-fill-tertiary cursor-auto"
          style={
            {
              WebkitUserDrag: "none",
              userDrag: "none",
              WebkitTouchCallout: "none",
            } as CSSProperties
          }
        >
          <List.Image>
            <Icon icon={account.icon} />
          </List.Image>
          <List.Content>
            <List.Trailing>
              <List.Title>
                <List.Text>{account.name}</List.Text>

                {/* TODO: Use chips component here */}
                {account.is_default && (
                  <div className="bg-fill-tertiary text-label-secondary rounded-lg px-1.5 leading-6 font-medium">
                    Default
                  </div>
                )}
              </List.Title>
              <List.Accessories>
                <List.Text level="3"> 􀆊</List.Text>
              </List.Accessories>
            </List.Trailing>
          </List.Content>
        </Link>
      </List.Item>
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
