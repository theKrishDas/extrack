import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";
import { DEFAULT_ACTIVE_TAB } from "@/lib/defaultValues";

import { Skeleton } from "@/components/ui/skeleton";

export default function NewTransactionFallback() {
  return (
    <>
      <Tabs
        defaultValue={DEFAULT_ACTIVE_TAB}
        className="pointer-events-none touch-none"
      >
        <TabsList className="mb-3 h-fit w-fit rounded-full bg-muted/30 p-0">
          <TabsTrigger
            className="h-9 w-12 rounded-full text-base data-[state=active]:shadow-none"
            value="income"
          >
            <IoAddSharp />
          </TabsTrigger>

          <TabsTrigger
            className="h-9 w-12 rounded-full text-base data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:shadow-none"
            value="expense"
          >
            <IoRemoveSharp />
          </TabsTrigger>
        </TabsList>

        <FallbackTabContent />
      </Tabs>
    </>
  );
}

function FallbackTabContent() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-28 rounded-full px-5" />
        <Skeleton className="h-10 w-28 rounded-full px-5" />
      </div>

      <Skeleton className="h-48 w-full rounded-3xl" />
    </div>
  );
}
