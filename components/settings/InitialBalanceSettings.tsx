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
  const [isInputDirty, setIsInputDirty] = useState(false);

  const handleEditStart = () => {
    setIsEditingInitialBalance(true);
  };

  const handleEditEnd = () => {
    // Resets the inpu value if not valid
    if (inputValue < MINIMUM_SARTING_BALANCE) handleCancelEdit();

    // Remove input
    setIsEditingInitialBalance(false);
  };

  const handleSaveEdit = async () => {
    // TODO: Do safe Parsing with zod

    const addStartingBalance = await import(
      "@/actions/handleStartingBalance"
    ).then((_) => _.addStartingBalance);

    const { error } = await addStartingBalance(inputValue);

    // TODO: Render alert
    if (error) window.alert(error);
  };

  const handleCancelEdit = () => {
    setInputValue(initialBalance);
    setIsInputDirty(false);
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
          disabled={isEditingInitialBalance}
          onClick={handleEditStart}
        >
          <RxPencil1 />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        {/* Input / display */}
        {isEditingInitialBalance ? (
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
              setIsInputDirty(values?.float != initialBalance);
            }}
            onBlur={handleEditEnd}
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
        {isInputDirty ? (
          <div className="flex gap-1">
            {/* Save buttons */}
            <Button
              size="icon"
              className={cn(
                "rounded-full text-lg",
                inputValue < MINIMUM_SARTING_BALANCE && "invisible",
              )}
              disabled={inputValue < MINIMUM_SARTING_BALANCE}
              onClick={handleSaveEdit}
            >
              <IoCheckmarkSharp />
            </Button>

            {/* Cancel edit button */}
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full text-lg"
              onClick={handleCancelEdit}
            >
              <IoCloseSharp />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
