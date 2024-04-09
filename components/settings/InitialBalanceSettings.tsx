import { Button } from "@/components/ui/button";
import { IoBag } from "react-icons/io5";
import { RxPencil1 } from "react-icons/rx";

export default function InitialBalanceSettings() {
  return (
    <div className="flex flex-col gap-7 rounded-3xl bg-card p-5">
      {/* Header */}
      <div className="inline-flex w-full items-center justify-between">
        {/* IDK */}
        <div className="inline-flex items-center gap-3">
          {/* Icon */}
          <div className="inline-grid place-content-center rounded-full text-lg">
            <IoBag />
          </div>
          <h4 className="text-lg">Initial balance</h4>
        </div>

        {/* Icon */}
        <Button
          className="h-12 w-12 rounded-full text-lg"
          variant="ghost"
          size="icon"
        >
          <RxPencil1 />
        </Button>
      </div>
      <p className="inline-flex items-start text-3xl tracking-tight text-foreground/70">
        <span className="pr-1 text-xl font-light text-foreground/40">₹</span>
        95,100
      </p>
    </div>
  );
}
