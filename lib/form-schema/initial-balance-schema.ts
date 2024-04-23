import { z } from "zod";
import { MINIMUM_SARTING_BALANCE } from "@/lib/defaultValues";

export const InitialBalanceSchema = z.object({
  amount: z.number().min(MINIMUM_SARTING_BALANCE, {
    message: "Initial balance can't be this low",
  }),
});

export type InitialBalanceInputType = z.infer<typeof InitialBalanceSchema>;
