import { Button } from "@/components/ui/button";
import { RxExclamationTriangle } from "react-icons/rx";

export default function InitialBalanceRemider({
  setButtonClicked,
}: {
  setButtonClicked: (_: boolean) => void; // eslint-disable-line no-unused-vars
}) {
  return (
    <>
      <section className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl bg-white px-3 py-3">
        <div className="flex w-full items-center justify-start gap-2 overflow-hidden">
          <RxExclamationTriangle className="text-lg text-[#FFCC00]" />
          <p className="w-full truncate">Initial balance not set </p>
        </div>

        <Button
          className="rounded-full bg-[#FFCC00]/10 text-[#FFCC00] shadow-none"
          variant="secondary"
          onClick={() => {
            setButtonClicked(true);
          }}
        >
          Set now
        </Button>
      </section>
    </>
  );
}
