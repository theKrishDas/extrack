"use client";

import { useState } from "react";
import InitialBalanceForm from "../initialBalance/InitialBalanceForm";
import InitialBalanceRemider from "../initialBalance/InitialBalanceRemider";
import { MINIMUM_SARTING_BALANCE } from "@/lib/defaultValues";

export default function StartingBalancePrompt({
  initialBalance,
}: {
  initialBalance: number;
}) {
  const [isButtonClicked, setButtonClicked] = useState(false);
  const [isStartingBalanceValid, setStartingBalanceValid] = useState(
    initialBalance >= MINIMUM_SARTING_BALANCE,
  );

  return (
    <>
      {!isStartingBalanceValid &&
        (isButtonClicked ? (
          <InitialBalanceForm
            setButtonClicked={setButtonClicked}
            setStartingBalanceValid={setStartingBalanceValid}
          />
        ) : (
          <InitialBalanceRemider setButtonClicked={setButtonClicked} />
        ))}
    </>
  );
}
