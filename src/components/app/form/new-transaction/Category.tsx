import {createListCollection, Listbox} from "@ark-ui/react/listbox"

import {type Category} from "@/lib/schema/category"
import {DrawerTitle} from "@/components/ui/drawer"
import {List} from "@/components/ui/list"
import {SquareRounded} from "@/components/icons/others"

//
// This is to type the mock data
// Remove this type when using convex querry
//
type DbCategory = {
  _id: string
  _createdTime: string
  name: Category["name"]
  color: Category["color"]
  type: Category["type"]
}

function createCollection(categories: DbCategory[]) {
  const mappedCategories = categories.map(cat => ({...cat, value: cat._id}))
  return createListCollection({items: mappedCategories})
}

const Category = () => {
  //
  // Mocking the Convex return type
  //
  // NOTE: This is a mock data.
  // Use the following when mocking is done:
  //
  // const categories = useQuerry(api.categories.get)
  // const collection = createCollection(categories)
  //
  const categories: DbCategory[] = [
    {name: "Groceries", color: "green"},
    {name: "Pink", color: "pink"},
    {name: "Indigo", color: "indigo"},
    {name: "Orange", color: "orange"},
  ].map(
    (c, idx) =>
      ({
        ...c,
        _id: `item-${idx}`,
        type: "income",
        _createdTime: "now",
      }) as DbCategory
  )

  // Creating the collection from the return-type
  const collection = createCollection(categories)

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
              const {_id: id, name, color} = item
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
