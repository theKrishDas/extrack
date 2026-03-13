import { useMutation, useQuery } from "convex/react"
import { Label } from "react-aria-components"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { List } from "@/components/ui/list-v2"
import { Switch } from "@/components/ui/switch"
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter"
import { cn } from "@/lib/utils"
import { DeleteAccount } from "./DeleteAccount"

export function OtherSettings({
  isEditing,
  account,
}: {
  isEditing: boolean
  account: Doc<"accounts">
}) {
  const defaultAccountId = useQuery(api.account.getDefault)
  const isDefaultAccount = defaultAccountId === account._id

  const formatter = useCurrencyFormatter()
  const fmtBalance = formatter.format(
    (account.startingBalance + account.netFlow) / 100
  )

  const toggleActive = useMutation(
    api.account.toggleActive
  ).withOptimisticUpdate((localStore, { id }) => {
    const existing = localStore.getQuery(api.account.getByStringId, { id })
    if (existing) {
      localStore.setQuery(
        api.account.getByStringId,
        { id },
        { ...existing, is_active: !existing.is_active }
      )
    }
  })

  return (
    <List.Root
      className={cn(
        "transition-all duration-350",
        isEditing && "pointer-events-none select-none opacity-25"
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
        <List.Text level="heading">Manage</List.Text>
      </List.Header>
      <List.Wrapper>
        <List.Item>
          <List.Content>
            <List.Trailing>
              <List.Title>
                <List.Text className="select-none">
                  <Label htmlFor="activate-account">Use this account</Label>
                </List.Text>
              </List.Title>
              <List.Accessories>
                <Switch
                  id="activate-account"
                  isDisabled={isDefaultAccount}
                  isSelected={account.is_active}
                  onChange={() => {
                    toggleActive({ id: account._id })
                  }}
                >
                  Toggle active
                </Switch>
              </List.Accessories>
            </List.Trailing>
          </List.Content>
        </List.Item>
      </List.Wrapper>
      <List.Footer>
        <List.Text level="footer">
          When turned off, this account will no longer accept new transactions.
          Existing transactions remain untouched.
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
