import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  TCategories,
  TTransactionType,
} from "@/lib/types/new-transaction-form-schema";
import { LuTrash } from "react-icons/lu";

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
        <ul className="flex h-full w-full flex-col gap-2 rounded-3xl bg-card p-4">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between ">
              <p className="capitalize">{cat.name}</p>

              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full"
              >
                <LuTrash />
                <span className="sr-only">Delete category</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
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
