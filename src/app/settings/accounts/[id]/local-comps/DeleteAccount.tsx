import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"

import { Button } from "@/components/ui/button/animated-button"
import { Drawer } from "@/components/ui/drawer/drawer-v2"
import { List } from "@/components/ui/list-v2"
import { Spacer } from "@/components/ui/spacer"

export function DeleteAccount({ account }: { account: Doc<"accounts"> }) {
  const [open, setOpen] = useState(false)
  const deleteAccount = useMutation(api.account.delete)
  const router = useRouter()

  const onDelete = () => {
    deleteAccount({ id: account._id })

    setOpen(false)
    router.push("/settings/accounts")
  }

  return (
    <Drawer.Root
      onOpenChange={setOpen}
      open={open}
      shouldScaleBackground={false}
    >
      <Drawer.Trigger asChild>
        <List.Item className="select-none">
          <List.Image color="red">􀈒</List.Image>
          <List.Content>
            <List.Trailing>
              <List.Title>
                <List.Text>Delete Account</List.Text>
              </List.Title>
            </List.Trailing>
          </List.Content>
        </List.Item>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Delete {account.name}?</Drawer.Title>
        </Drawer.Header>
        <div className="flex flex-col gap-2 px-4">
          <p>
            You are about to delete this account. All your transactions
            associated with this account will be deleted aswell!
          </p>

          <Button color="gray" fullWidth onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="red" fullWidth onPress={onDelete}>
            Delete
          </Button>
        </div>
        <Spacer className="h-4" />
      </Drawer.Content>
    </Drawer.Root>
  )
}
