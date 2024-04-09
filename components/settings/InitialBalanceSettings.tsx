"use client";

import { Button } from "@/components/ui/button";
import { IoBag } from "react-icons/io5";
import { RxPencil1 } from "react-icons/rx";
import CurrencyInput from "react-currency-input-field";
import { useState } from "react";

export default function InitialBalanceSettings({
  initialBalance,
}: {
  initialBalance: number;
}) {
  const [isEditingInitialBalance, setIsEditingInitialBalance] = useState(false);

  const handleEditStart = () => {
    setIsEditingInitialBalance(true);
  };

  const handleEditEnd = () => {
    // Send the data to back-end

    // Remove input
    setIsEditingInitialBalance(false);
  };

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
          disabled={isEditingInitialBalance}
          onClick={() => handleEditStart()}
        >
          <RxPencil1 />
        </Button>
      </div>
      {isEditingInitialBalance ? (
        <TheInput handleEditEnd={handleEditEnd} />
      ) : (
        <p className="inline-flex items-start text-3xl tracking-tight text-foreground/70">
          <span className="pr-1 text-xl font-light text-foreground/40">₹</span>
          {initialBalance}
        </p>
      )}
    </div>
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
      onBlur={() => handleEditEnd()}
    />
  );
}
