"use client";

import { MINIMUM_SARTING_BALANCE } from "@/defaultValues";
import { Button } from "@/components/ui/button";
import { IoBag, IoCloseSharp, IoCheckmarkSharp } from "react-icons/io5";
import { RxPencil1 } from "react-icons/rx";
import CurrencyInput from "react-currency-input-field";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function InitialBalanceSettings({
  initialBalance,
}: {
  initialBalance: number;
}) {
  const [isEditingInitialBalance, setIsEditingInitialBalance] = useState(false);
  const [inputValue, setInputValue] = useState(initialBalance);

  const handleEditStart = () => {
    setIsEditingInitialBalance(true);
  };

  const handleEditEnd = () => {
    // Send the data to back-end

    // Resets the inpu value if not valid
    if (inputValue < MINIMUM_SARTING_BALANCE) setInputValue(initialBalance);

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
          <TheInput
            initialBalance={initialBalance}
            handleEditEnd={handleEditEnd}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        ) : (
          <p
            className="inline-flex w-full items-start text-3xl tracking-tight text-foreground/70"
            onClick={handleEditStart}
          >
            <span className="pr-1 text-xl font-light text-foreground/40">
              ₹
            </span>
            {inputValue ? inputValue : initialBalance}
          </p>
        )}

        {/* Controle bttons */}
        {inputValue != initialBalance ? (
          <div className="flex gap-1">
            {/* Save buttons */}
            <Button
              size="icon"
              className={cn(
                "rounded-full text-lg",
                inputValue < MINIMUM_SARTING_BALANCE && "invisible",
              )}
              disabled={inputValue < MINIMUM_SARTING_BALANCE}
            >
              <IoCheckmarkSharp />
            </Button>

            {/* Clear button */}
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

function TheInput({
  initialBalance,
  inputValue,
  handleEditEnd,
  setInputValue,
}: {
  initialBalance: number;
  inputValue: number;
  handleEditEnd: () => void;
  setInputValue: (_: number) => void; // eslint-disable-line no-unused-vars
}) {
  return (
    <CurrencyInput
      autoFocus
      decimalsLimit={2}
      allowNegativeValue={false}
      maxLength={8}
      placeholder="New Balance"
      className="inline-flex w-full items-start border-none text-3xl tracking-tight text-foreground/70 outline-none"
      defaultValue={inputValue || initialBalance}
      onValueChange={(_, __, values) => {
        setInputValue(values?.float ?? initialBalance);
      }}
      onBlur={() => handleEditEnd()}
    />
  );
}