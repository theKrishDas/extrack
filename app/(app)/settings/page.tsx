import { IoBag } from "react-icons/io5";
import { RxPencil1 } from "react-icons/rx";

export default function SettingsPage() {
  return (
    <>
      <p>Settings page</p>
      <InitialBalanceSettings />
    </>
  );
}

function InitialBalanceSettings() {
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
        <div className="inline-grid h-12 w-12 place-content-center rounded-full bg-none text-lg text-card-foreground/40">
          <RxPencil1 />
        </div>
      </div>
      <p className="inline-flex items-start text-5xl tracking-tight text-foreground/70">
        <span className="pr-1 text-3xl font-light text-foreground/40">₹</span>
        95,100
      </p>
    </div>
  );
}
