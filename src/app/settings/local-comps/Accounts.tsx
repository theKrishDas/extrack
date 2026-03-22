import NumberFlow from "@number-flow/react"
import { useQuery } from "convex-helpers/react/cache/hooks"
import { type CSSProperties, useState } from "react"
import { Link, Button as RacButton } from "react-aria-components"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { limit } from "#lib/constants/constraints"
import { Form } from "@/components/form/account/new"
import { Spinner } from "@/components/loading/spinner"
import { CircularMeter } from "@/components/ui/circular-meter"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import { Emoji } from "@/components/ui/emoji"
import { List } from "@/components/ui/list-v2"
import { Spacer } from "@/components/ui/spacer"
import { CURRENCY } from "@/lib/date-utils"

export function Accounts() {
  const accounts = useQuery(api.account.list)
  const defaultAccountId = useQuery(api.account.getDefault)

  if (!accounts) return <Spinner />

  // convert cents to dollars and fix to 2 decimals
  const totalBalance =
    accounts.reduce((acc, v) => acc + v.netFlow + v.startingBalance, 0) / 100

  return (
    <>
      <div className="flex h-44 flex-col items-center justify-center pb-5 text-center">
        <NumberFlow
          className="font-bold text-5xl"
          format={{
            style: "currency",
            currency: CURRENCY,
            trailingZeroDisplay: "stripIfInteger",
            maximumFractionDigits: 2,
          }}
          style={{ "--number-flow-char-height": "1.2ch" } as CSSProperties}
          value={totalBalance}
        />
      </div>

      <List.Root>
        <List.Wrapper>
          {accounts.map((account) => (
            <AccountItems
              account={account}
              isDefault={defaultAccountId === account._id}
              key={account._id}
            />
          ))}

          <NewAccountDrawer accountCount={accounts.length} />
        </List.Wrapper>
      </List.Root>
    </>
  )
}

function AccountItems(props: { account: Doc<"accounts">; isDefault: boolean }) {
  const { account, isDefault } = props
  const slug = account._id

  return (
    <List.Item asChild>
      <Link
        className="cursor-auto data-pressed:bg-fill-tertiary"
        href={`/settings/accounts/${slug}`}
        style={
          {
            WebkitUserDrag: "none",
            userDrag: "none",
            WebkitTouchCallout: "none",
          } as CSSProperties
        }
      >
        <List.Image>
          <Emoji className="text-xl">{account.icon}</Emoji>
        </List.Image>
        <List.Content>
          <List.Trailing>
            <List.Title>
              <List.Text>{account.name}</List.Text>

              {/* TODO: Use chips component here */}
              {isDefault && (
                <div className="rounded-lg bg-fill-tertiary px-1.5 font-medium text-label-secondary leading-6">
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
  )
}

const ACCOUNTS_MAX = limit.count.accounts.perUserMax

function NewAccountDrawer(props: { accountCount: number }) {
  const { accountCount } = props
  const [open, setOpen] = useState(false)

  const remaining = Math.max(0, ACCOUNTS_MAX - accountCount)
  const isAtLimit = remaining === 0

  return (
    <Drawer.Root onOpenChange={setOpen} open={open} showHandle>
      <List.Item asChild>
        <Drawer.Trigger asChild>
          <RacButton
            className="data-pressed:bg-fill-tertiary data-pressed:**:[[role='separator']]:bg-fill-opaque"
            isDisabled={isAtLimit}
          >
            <List.Image
              style={
                {
                  "--list-image-color": isAtLimit
                    ? "var(--color-label-tertiary)"
                    : "var(--ios-blue)",
                } as CSSProperties
              }
            >
              􀅼
            </List.Image>
            <Spacer className="" />

            <List.Content>
              <List.Trailing>
                <List.Title>
                  <List.Text
                    className={
                      isAtLimit ? "text-label-tertiary" : "text-ios-blue"
                    }
                  >
                    Add new account
                  </List.Text>
                </List.Title>
                <List.Accessories>
                  <CircularMeter
                    aria-label={`${remaining} of ${ACCOUNTS_MAX} account slots remaining`}
                    formatOptions={{
                      maximumFractionDigits: 0,
                      style: "decimal",
                    }}
                    maxValue={ACCOUNTS_MAX}
                    minValue={0}
                    muted={isAtLimit}
                    svgTitle="Account slots remaining"
                    value={remaining}
                  />
                </List.Accessories>
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
