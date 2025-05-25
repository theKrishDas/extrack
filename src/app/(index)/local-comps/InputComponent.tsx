import {api} from "#/convex/_generated/api"
import {useMutation} from "convex/react"
import {
  Form,
  Input,
  Label,
  NumberField,
  Text,
  TextField,
} from "react-aria-components"

import {newTransactionSchema} from "@/lib/types/new-transaction-schema"
import {Button} from "@/components/ui/button"
import {
  MatCloseRounded,
  MatRefreshRounded,
  MatUnfoldMoreRounded,
} from "@/components/icons/mat"

export default function InputComponent() {
  const addTransaction = useMutation(api.transactions.addTransaction)

  const handleTransactionAdd = (formData: FormData) => {
    const parsedData = {
      amount: Number(formData.get("amount")) as unknown,
      note: formData.get("note") as unknown,
      type: "expense" as const, // formData.get("type") as unknown,
    }

    const result = newTransactionSchema.safeParse(parsedData)
    if (result.error) {
      // TODO: Use winston for logging instead
      // eslint-disable-next-line no-console
      console.error({
        message: "ZOD ERROR: Form data validation unsuccessfull!",
        info: {
          message: JSON.parse(result.error.message),
          error: result.error,
        },
      })
      return
    }

    const {
      data: {note, ...rest},
    } = result

    // Make sure note is not an empty string
    // I don't want to deal with empty strings
    const modyfiedNote =
      note !== undefined && note.length === 0 ? undefined : note

    addTransaction({...rest, note: modyfiedNote})
  }

  return (
    <Form
      className="inline-flex w-full flex-col items-center"
      onSubmit={e => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        handleTransactionAdd(data)
        e.currentTarget.reset()
      }}
    >
      <Nav />

      <NumberField name="amount" minValue={0.1} isRequired>
        <Label className="sr-only">Amount</Label>
        <Input
          className="text-label-primary/90 h-62 w-full text-center text-5xl font-medium"
          placeholder="0"
        />
        <Text slot="description" className="sr-only">
          Minimum transaction amount is 0.1
        </Text>
      </NumberField>

      <TextField name="note" type="text">
        <Label className="sr-only">Transaction Note</Label>
        <Input
          className="bg-fill-quaternary text-label-secondary w-full max-w-30 rounded-xl px-3 py-2 text-center text-sm leading-5.5 select-none"
          placeholder="Add note"
        />
        <Text slot="description" className="sr-only">
          Add a brief note for future reference.
        </Text>
      </TextField>

      <div className="mt-10 flex w-full justify-center">
        <Button variant="filled" color="blue" type="submit">
          Save
        </Button>
      </div>
    </Form>
  )
}

const Nav = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="inline-flex items-center gap-1">
        <Button color="gray" size="sm" type="button" isDisabled>
          Today
        </Button>
        <Button
          color="gray"
          size="sm"
          className="[&_svg]:-mr-1"
          type="button"
          isDisabled
        >
          Category
          <MatUnfoldMoreRounded />
        </Button>
        <Button color="gray" size="sm" isIconOnly variant="ghost" type="reset">
          <MatRefreshRounded />
        </Button>
      </div>

      <Button
        color="gray"
        size="sm"
        isIconOnly
        variant="ghost"
        type="button"
        isDisabled
      >
        <MatCloseRounded />
      </Button>
    </div>
  )
}
