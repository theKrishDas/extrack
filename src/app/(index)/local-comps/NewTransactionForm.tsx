"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Form} from "react-aria-components"
import {useForm} from "react-hook-form"

import {
  newTransactionSchema,
  NewTransactionSchemaType,
} from "@/lib/schema/new-transaction-schema"
import {Button} from "@/components/ui/button/animated-button"
import {List} from "@/components/ui/list"
import AmountInput from "@/components/app/form/new-transaction/Amount"
import {IonAddCircle, IonChevronForward} from "@/components/icons/ion"
import {MatWallet} from "@/components/icons/mat"
import {CalendarToday, SquareRounded} from "@/components/icons/others"

export default function NewTrasactionForm({
  afterSubmit,
}: {
  afterSubmit?: () => void
}) {
  const {handleSubmit, control} = useForm<NewTransactionSchemaType>({
    defaultValues: {
      amount: undefined,
      note: undefined,
      type: "expense",
    },
    resolver: zodResolver(newTransactionSchema),
  })
  const onSubmit = (data: NewTransactionSchemaType) => {
    console.log(data)
    afterSubmit?.()
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <AmountInput control={control} />

      <List.Root>
        <List.Item>
          <List.Icon className="text-label-secondary" asChild>
            <CalendarToday />
          </List.Icon>
          <List.Content>
            <List.Text>Date</List.Text>
            <div className="[&_svg]:text-label-secondary inline-flex flex-row-reverse items-center gap-1">
              <IonChevronForward />
              <List.Text level="1">Today</List.Text>
            </div>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon className="text-ios-teal" asChild>
            <SquareRounded />
          </List.Icon>
          <List.Content>
            <List.Text>Category</List.Text>
            <div className="[&_svg]:text-label-secondary inline-flex flex-row-reverse items-center gap-1">
              <IonChevronForward />
              <List.Text level="1">Groceries</List.Text>
            </div>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon className="text-label-secondary" asChild>
            <IonAddCircle />
          </List.Icon>
          <List.Content>
            <List.Text>Note</List.Text>
            <div className="[&_svg]:text-label-secondary inline-flex flex-row-reverse items-center gap-1">
              <IonChevronForward />
            </div>
          </List.Content>
        </List.Item>
      </List.Root>

      <List.Root noSpacing className="mb-8">
        <List.Item>
          <List.Icon className="text-label-secondary" asChild>
            <MatWallet />
          </List.Icon>
          <List.Content>
            <List.Text>Account</List.Text>
            <div className="[&_svg]:text-label-secondary inline-flex flex-row-reverse items-center gap-1">
              <IonChevronForward />
              <List.Text level="1">Cash</List.Text>
            </div>
          </List.Content>
        </List.Item>
      </List.Root>

      <Button className="rounded-2xl" variant="filled" fullWidth type="submit">
        Save
      </Button>
    </Form>
  )
}
