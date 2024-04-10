"use client";

import { Button } from "@/components/ui/button";
import { IoBag, IoCloseSharp, IoCheckmarkSharp } from "react-icons/io5";
import { RxPencil1 } from "react-icons/rx";
import CurrencyInput from "react-currency-input-field";
import { useState } from "react";

export default function InitialBalanceSettings({
  initialBalance,
}: {
  initialBalance: number;
}) {
  const [isEditingInitialBalance, setIsEditingInitialBalance] = useState(false);
  const [isInputDirty, setIsInputDirty] = useState(false);

  const handleEditStart = () => {
    setIsEditingInitialBalance(true);
  };

  const handleEditEnd = () => {
    // Send the data to back-end

    // Remove input
    setIsEditingInitialBalance(false);
  };

  return (
    <section className="flex flex-col gap-7 rounded-3xl bg-card p-5">
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

        {/* Edit Button */}
        <Button
          className="h-12 w-12 rounded-full text-lg"
          variant="ghost"
          size="icon"
          // disabled={isEditingInitialBalance}
          onClick={() => handleEditStart()}
        >
          <RxPencil1 />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        {/* Input / display */}
        {isEditingInitialBalance ? (
          <TheInput handleEditEnd={handleEditEnd} />
        ) : (
          <p className="inline-flex w-full items-start text-3xl tracking-tight text-foreground/70">
            <span className="pr-1 text-xl font-light text-foreground/40">
              ₹
            </span>
            {initialBalance}
          </p>
        )}

        {/* Save bttons */}
        {isInputDirty ? (
          <div className="flex flex-row-reverse gap-1">
            <Button size="icon" className="rounded-full text-lg">
              <IoCheckmarkSharp />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full text-lg"
            >
              <IoCloseSharp />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function TheInput({ handleEditEnd }: { handleEditEnd: () => void }) {
  return (
    <CurrencyInput
      autoFocus
      decimalsLimit={2}
      allowNegativeValue={false}
      maxLength={8}
      placeholder="New Balance"
      className="w-full"
      onBlur={() => handleEditEnd()}
    />
  );
}
