import {createListCollection, Listbox} from "@ark-ui/react/listbox"

import {DrawerHandle, DrawerTitle} from "@/components/ui/drawer"
import {List} from "@/components/ui/list"
import {SquareRounded} from "@/components/icons/others"

const categories: {
  color:
    | "gray"
    | "blue"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "mint"
    | "teal"
    | "cyan"
    | "indigo"
    | "purple"
    | "pink"
    | "brown"
  value: string
  name: string
  id: string
}[] = [
  {id: "one", name: "Groceries", color: "green", value: "Groceries"},
  {id: "two", name: "Pink", color: "pink", value: "Pink"},
  {id: "three", name: "Indigo", color: "indigo", value: "Indigo"},
  {id: "four", name: "Orange", color: "orange", value: "Orange"},
]

const collection = createListCollection({items: categories})

const Category = () => {
  return (
    <>
      <DrawerTitle className="my-4 text-center">Categories</DrawerTitle>

      <Listbox.Root
        className="px-4"
        onSelect={v => console.log(v.value)}
        collection={collection}
        defaultValue={[collection.items[0].value]}
        loopFocus
      >
        <Listbox.Label className="sr-only">Select your Framework</Listbox.Label>
        <Listbox.Content asChild>
          <List.Root className="ring-ios-blue/[var(--separator-non-opaque-opacity)] ring-offset-background rounded-2xl ring-offset-1 outline-none focus-visible:ring-4">
            {collection.items.map(item => {
              const {id, name, color} = item
              return (
                <Listbox.Item item={item} key={id} asChild>
                  <List.Item className="data-highlighted:bg-fill-secondary [&:has(+_*[data-highlighted])_.ListContent]:border-transparent data-highlighted:[&>.ListContent]:border-transparent">
                    <List.Icon asChild>
                      <SquareRounded
                        style={{color: `var(--ios-${color})`}}
                        className="relative"
                      />
                    </List.Icon>
                    <List.Content>
                      <Listbox.ItemText asChild>
                        <List.Text level="1" className="relative">
                          {name}
                        </List.Text>
                      </Listbox.ItemText>
                      <Listbox.ItemIndicator className="bg-ios-blue h-3 w-3 rounded-full" />
                    </List.Content>
                  </List.Item>
                </Listbox.Item>
              )
            })}
          </List.Root>
        </Listbox.Content>
      </Listbox.Root>
    </>
  )
}

export default Category
