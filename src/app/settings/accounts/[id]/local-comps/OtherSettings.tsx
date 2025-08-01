import {useNumberFormatter} from "@react-aria/i18n"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useMutation} from "convex/react"
import {Label} from "react-aria-components"

import {CURRENCY} from "@/lib/date-utils"
import {cn} from "@/lib/utils"
import {List} from "@/components/ui/list-v2"
import {Switch} from "@/components/ui/switch/Switch"

import {DeleteAccount} from "./DeleteAccount"

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
  const toggleActive = useMutation(
    api.accounts.toggleActive
  ).withOptimisticUpdate((localStore, {id}) => {
    const existing = localStore.getQuery(api.accounts.getByStringId, {id})
    if (!!existing) {
      localStore.setQuery(
        api.accounts.getByStringId,
        {id},
        {...existing, is_active: !existing.is_active}
      )
    }
  })
  const setDefault = useMutation(api.accounts.setDefault).withOptimisticUpdate(
    (localStore, {id, default: val}) => {
      const existing = localStore.getQuery(api.accounts.getByStringId, {id})
      if (!!existing) {
        localStore.setQuery(
          api.accounts.getByStringId,
          {id},
          {...existing, is_default: val}
        )
      }
    }
  )

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
                <List.Text className="select-none">
                  <Label htmlFor="activate-account">Active</Label>
                </List.Text>
              </List.Title>
              <List.Accessories>
                <Switch
                  id="activate-account"
                  isSelected={account.is_active}
                  onChange={() => {
                    toggleActive({id: account._id})
                    setDefault({id: account._id, default: false})
                  }}
                >
                  Toggle active
                </Switch>
              </List.Accessories>
            </List.Trailing>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Trailing>
              <List.Title>
                <List.Text className="select-none">
                  <Label htmlFor="default-account">Set as Default</Label>
                </List.Text>
              </List.Title>
              <List.Accessories>
                <Switch
                  id="default-account"
                  isSelected={account.is_default}
                  isDisabled={!account.is_active}
                  onChange={v => setDefault({id: account._id, default: v})}
                >
                  Default account
                </Switch>
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
        <DeleteAccount account={account} />

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
