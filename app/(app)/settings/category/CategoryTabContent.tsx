import { TabsContent } from "@/components/ui/tabs";
import {
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";
import CreateNewCategoryDrawer from "./CreateNewCategoryDrawer";
import CategoryDeleteButton from "./CategoryDeleteButton";

export default function CategoryTabContent({
  type,
  categories,
}: {
  type: TTransactionType;
  categories: TCategories[];
}) {
  return (
    <TabsContent value={type}>
      {categories.length <= 0 ? (
        <NoCategoryMessege />
      ) : (
        <ul className="flex w-full flex-col rounded-2xl bg-card">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex h-14 items-center justify-between px-4"
            >
              <p className="capitalize">{cat.name}</p>
              <CategoryDeleteButton category={cat} />
            </li>
          ))}
        </ul>
      )}
      <CreateNewCategoryDrawer type={type} />
    </TabsContent>
  );
}

function NoCategoryMessege() {
  return (
    <div className="grid h-44 w-full place-content-center gap-2 rounded-3xl p-4">
      <p className="text-sm font-semibold text-foreground/20">No categories</p>
    </div>
  );
}
