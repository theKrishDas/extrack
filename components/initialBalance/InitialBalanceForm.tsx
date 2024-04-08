import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import { IoCloseSharp } from "react-icons/io5";
import { InitialBalanceInputType } from "@/lib/form-schema/initial-balance-schema";
import { MINIMUM_SARTING_BALANCE } from "@/defaultValues";

export default function InitialBalanceForm({
  setButtonClicked,
  setStartingBalanceValid,
}: {
  setButtonClicked: (_: boolean) => void; // eslint-disable-line no-unused-vars
  setStartingBalanceValid: (_: boolean) => void; // eslint-disable-line no-unused-vars
}) {
  const { handleSubmit, control, watch } = useForm<InitialBalanceInputType>();
  const inputAmount = watch("amount");

  const onSubmit: SubmitHandler<InitialBalanceInputType> = async (data) => {
    setStartingBalanceValid(true);

    const addStartingBalance = await import(
      "@/actions/handleStartingBalance"
    ).then((_) => _.addStartingBalance);

    const { error } = await addStartingBalance(data.amount);

    // TODO: Render alert
    if (error) window.alert(error);
  };

  return (
    <form
      className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl bg-white px-3 py-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="amount"
        render={({ field: { value, onChange } }) => (
          <CurrencyInput
            autoFocus
            decimalsLimit={2}
            allowNegativeValue={false}
            maxLength={8}
            value={value}
            onValueChange={(value) => onChange(value)}
            placeholder="Add starting balance"
            className="w-full border-none text-lg outline-none"
          />
        )}
      />

      <div className="flex flex-row-reverse gap-2">
        {/* --- Save button ---  */}
        <Button
          className="rounded-full"
          type="submit"
          disabled={!inputAmount || inputAmount < MINIMUM_SARTING_BALANCE}
        >
          Save
        </Button>

        {/* --- X button ---  */}
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          type="button"
          onClick={() => {
            setButtonClicked(false);
          }}
        >
          <IoCloseSharp />
        </Button>
      </div>
    </form>
  );
}
