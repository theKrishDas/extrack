"use server";

import { wait } from "@/lib/utils";

export async function addStartingBalance(amount: number) {
  await wait(2000);

  const mappedAmount = Math.abs(amount) * 100;

  const roundedAmount = parseFloat(mappedAmount.toFixed(2));

  console.log(roundedAmount);
}
