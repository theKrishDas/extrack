import { createListCollection, Listbox } from "@ark-ui/react/listbox"
import { useQuery } from "convex-helpers/react/cache/hooks"
import { useEffect } from "react"
import { Button as RacButton } from "react-aria-components"
import { Controller } from "react-hook-form"
import { api } from "#/convex/_generated/api"
import type { Doc } from "#/convex/_generated/dataModel"
import { IonChevronForward } from "@/components/icons/ion"
import { SquareRounded } from "@/components/icons/others"
import {
  DrawerContent,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { List } from "@/components/ui/list"
import { Skeleton } from "@/components/ui/loading/skeleton"

import { getLastUsedCategory, setLastUsedCategory } from "./helpers"
import { useNewTransaction } from "./provider"

function createCollection(categories: Doc<"categories">[]) {
  const mappedCategories = categories.map((cat) => ({ ...cat, value: cat._id }))
  return createListCollection({ items: mappedCategories })
}

const CategorySelect = () => {
  const {
    form: { control, setValue },
    transactionType,
  } = useNewTransaction()

  const availableCategories = useQuery(api.category.listByType, {
    type: transactionType,
  })
  const categoryFromLocalStorage = getLastUsedCategory(transactionType)

  useEffect(() => {
    if (!availableCategories?.length) return

    let categoryId: string

    if (categoryFromLocalStorage) {
      const validCategory = availableCategories.find(
        (category) => category._id === categoryFromLocalStorage.id
      )
      categoryId = validCategory
        ? validCategory._id
        : availableCategories[0]._id
    } else {
      categoryId = availableCategories[0]._id
    }

    setLastUsedCategory(transactionType, categoryId)
    setValue("category", categoryId)
  }, [availableCategories, categoryFromLocalStorage, transactionType, setValue])

  if (!availableCategories)
    return (
      <List.Item asChild>
        <Skeleton />
      </List.Item>
    )

  if (availableCategories.length <= 0) {
    // TODO: Handle this properly
    return <p>No categories found: Add one</p>
  }

  // Creating the collection from the return-type
  const collection = createCollection(availableCategories)

  return (
    <Controller
      control={control}
      name="category"
      render={({ field: { value, onChange, onBlur, ref } }) => {
        const selectedCategory = collection.find(value)

        return (
          <DrawerNested>
            <DrawerTrigger asChild>
              <List.Item asChild>
                <RacButton className="w-full">
                  <List.Content>
                    <List.Text>Category</List.Text>
                    <div className="inline-flex flex-row-reverse items-center gap-1">
                      <IonChevronForward className="text-label-secondary" />
                      {selectedCategory ? (
                        <List.Text level="1">{selectedCategory.name}</List.Text>
                      ) : (
                        <List.Text level="3">Empty</List.Text>
                      )}
                      <SquareRounded
                        style={{
                          color: `var(--ios-${selectedCategory?.color})`,
                        }}
                      />
                    </div>
                  </List.Content>
                </RacButton>
              </List.Item>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerTitle className="my-4 text-center">Categories</DrawerTitle>

              <Listbox.Root
                className="px-4"
                collection={collection}
                loopFocus
                onBlur={onBlur}
                onSelect={(v) => {
                  onChange(v.value)
                }}
                ref={ref}
                value={[value]}
              >
                <Listbox.Label className="sr-only">
                  Select a category
                </Listbox.Label>
                <Listbox.Content asChild>
                  <List.Root className="rounded-2xl outline-none ring-ios-blue/[var(--separator-non-opaque-opacity)] ring-offset-1 ring-offset-background focus-visible:ring-4">
                    {collection.items.map((item) => {
                      const { _id: id, name, color } = item
                      return (
                        <Listbox.Item asChild item={item} key={id}>
                          <List.Item className="data-highlighted:bg-fill-secondary [&:has(+_*[data-highlighted])_.ListContent]:border-transparent data-highlighted:[&>.ListContent]:border-transparent">
                            <List.Icon asChild>
                              <SquareRounded
                                className="relative"
                                style={{ color: `var(--ios-${color})` }}
                              />
                            </List.Icon>
                            <List.Content>
                              <Listbox.ItemText asChild>
                                <List.Text className="relative" level="1">
                                  {name}
                                </List.Text>
                              </Listbox.ItemText>
                              <Listbox.ItemIndicator className="h-3 w-3 rounded-full bg-ios-blue" />
                            </List.Content>
                          </List.Item>
                        </Listbox.Item>
                      )
                    })}
                  </List.Root>
                </Listbox.Content>
              </Listbox.Root>
            </DrawerContent>
          </DrawerNested>
        )
      }}
    />
  )
}

export default CategorySelect
