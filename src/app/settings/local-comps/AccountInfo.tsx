import {useNumberFormatter} from "@react-aria/i18n"
import {Doc} from "#/convex/_generated/dataModel"

import {CURRENCY} from "@/lib/date-utils"
import {Button} from "@/components/ui/button/animated-button"
import {List} from "@/components/ui/list-v2"
import {Spacer} from "@/components/ui/spacer"

export function AccountInfo({account}: {account: Doc<"accounts">}) {
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })
  const fmtBalance = formatter.format(account.currentBalance)

  return (
    <>
      <Button size="sm" className="absolute top-0 right-0">
        Edit
      </Button>

      <div className="flex w-full flex-col items-center justify-center">
        <Button
          className="font-rnx-rounded size-32 overflow-hidden rounded-full text-6xl text-white sm:size-32 md:size-24 md:text-3xl"
          size="lg"
          color="gray"
          variant="tinted"
        >
          🫵
        </Button>

        <p className="mt-2 text-2xl font-bold">Main</p>
      </div>

      <Spacer className="h-2" />

      <List.Root>
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
                  <List.Text>Default</List.Text>
                </List.Title>
                <List.Accessories>
                  <List.Text level="3">􀁣</List.Text>
                </List.Accessories>
              </List.Trailing>
            </List.Content>
          </List.Item>
        </List.Wrapper>
        <List.Footer>
          <List.Text level="footer">
            Only one account can be marked as the default. Choosing this account
            as default will unset the previous default account.
          </List.Text>
        </List.Footer>

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
    </>
  )
}
