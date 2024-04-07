"use client";

import { useState } from "react";
import InitialBalanceForm from "../initialBalance/InitialBalanceForm";
import InitialBalanceRemider from "../initialBalance/InitialBalanceRemider";

export default function StartingBalancePrompt() {
  const [isButtonClicked, setButtonClicked] = useState(false);
  const [isStartingBalanceValid, setStartingBalanceValid] = useState(false);

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
