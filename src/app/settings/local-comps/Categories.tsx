import {useState} from "react"
import {Icon} from "@iconify/react/dist/iconify.cjs"
import {api} from "#/convex/_generated/api"
import {Doc} from "#/convex/_generated/dataModel"
import {useMutation, useQuery} from "convex/react"

import {Button} from "@/components/ui/button/animated-button"
import {Drawer} from "@/components/ui/drawer/drawer-v2"
import {List} from "@/components/ui/list-v2"
import {Spacer} from "@/components/ui/spacer"
import {Spinner} from "@/components/loading/spinner"

export function Categories() {
  const categories = useQuery(api.categories.getAll)

  if (!categories) return <Spinner />

  const incomeCategories = categories.filter(_ => _.type === "income")
  const expenseCategories = categories.filter(_ => _.type === "expense")

  return (
    <>
      <List.Root>
        <List.Header className="relative flex items-center">
          <List.Text level="heading">Expense</List.Text>
          <Button
            size="xs"
            variant="ghost"
            isIconOnly
            className="absolute right-4.5"
            isDisabled
          >
            􀅼
          </Button>
        </List.Header>
        <List.Wrapper>
          {expenseCategories.map(cat => (
            <Item category={cat} key={cat._id} />
          ))}
        </List.Wrapper>

        <List.Header className="relative flex items-center">
          <List.Text level="heading">Income</List.Text>
          <Button
            size="xs"
            variant="ghost"
            isIconOnly
            className="absolute right-4.5"
            isDisabled
          >
            􀅼
          </Button>
        </List.Header>
        <List.Wrapper>
          {incomeCategories.map(cat => (
            <Item category={cat} key={cat._id} />
          ))}
        </List.Wrapper>
      </List.Root>
    </>
  )
}

function Item({category}: {category: Doc<"categories">}) {
  return (
    <List.Item key={category._id}>
      <List.Image>
        <Icon icon={category.icon} />
      </List.Image>
      <List.Content>
        <List.Trailing>
          <List.Title>
            <List.Text>{category.name}</List.Text>
          </List.Title>
          <List.Accessories>
            <CategoryActions category={category} />
          </List.Accessories>
        </List.Trailing>
      </List.Content>
    </List.Item>
  )
}

function CategoryActions({category}: {category: Doc<"categories">}) {
  const [open, setOpen] = useState(false)
  const deleteCategory = useMutation(api.categories.remove)
  const handleDelete = () => {
    deleteCategory({id: category._id})
    setOpen(false)
  }

  return (
    <Drawer.Root
      showHandle
      shouldScaleBackground={false}
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant="ghost"
        color="gray"
        size="sm"
        isIconOnly
        className="touch-auto"
        onPress={() => setOpen(true)}
      >
        􀍠
      </Button>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title srOnly>Actions</Drawer.Title>
        </Drawer.Header>

        <div className="flex flex-col gap-2 px-4 [&_button]:w-full [&_button]:rounded-full">
          <Button color="gray" size="lg">
            Edit
          </Button>

          <DeleteCategory category={category} onDelete={handleDelete} />
        </div>
        <Spacer className="h-4" />
      </Drawer.Content>
    </Drawer.Root>
  )
}

function DeleteCategory({
  category,
  onDelete,
}: {
  category: Doc<"categories">
  onDelete: () => void
}) {
  return (
    <Drawer.NestedRoot shouldScaleBackground={false}>
      <Drawer.Trigger asChild>
        <Button
          color="red"
          variant="tinted"
          size="lg"
          isDisabled={category.is_vendor}
        >
          Delete
        </Button>
      </Drawer.Trigger>

      {category.is_vendor && (
        <List.Text className="text-center" level="footer">
          This is a pre-shipped category and can’t be deleted.
        </List.Text>
      )}

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Delete {category.name}?</Drawer.Title>
        </Drawer.Header>
        <div className="flex flex-col gap-2 px-4">
          <p>
            You are about to delete this category. All your transactions with
            this category will be deleted aswell!
          </p>

          <Drawer.ClosePrimitive asChild>
            <Button color="gray" fullWidth>
              Cancel
            </Button>
          </Drawer.ClosePrimitive>

          <Drawer.ClosePrimitive asChild>
            <Button color="red" fullWidth onPress={onDelete}>
              Delete
            </Button>
          </Drawer.ClosePrimitive>
        </div>
        <Spacer className="h-4" />
      </Drawer.Content>
    </Drawer.NestedRoot>
  )
}
