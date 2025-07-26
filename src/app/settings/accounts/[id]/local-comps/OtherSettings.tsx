import {useNumberFormatter} from "@react-aria/i18n"
import {Doc} from "#/convex/_generated/dataModel"

import {CURRENCY} from "@/lib/date-utils"
import {cn} from "@/lib/utils"
import {List} from "@/components/ui/list-v2"

export function OtherSettings({
  isEditing,
  account,
}: {
  isEditing: boolean
  account: Doc<"accounts">
}) {
  const formatter = useNumberFormatter({
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  })
  const fmtBalance = formatter.format(account.currentBalance)

  return (
    <List.Root
      className={cn(
        "transition-all duration-350",
        isEditing && "pointer-events-none opacity-25 select-none"
      )}
    >
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
                <List.Text level="3">Indian Rupee</List.Text>
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
  )
}
