"use client"

import {ReactNode} from "react"
import {Form, Button as RacButton} from "react-aria-components"

import {NewTransactionSchemaType} from "@/lib/schema/new-transaction-schema"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {List} from "@/components/ui/list"
import AmountInput from "@/components/app/form/new-transaction/Amount"
import {useFormContext} from "@/components/app/form/new-transaction/context-helpers"
import Note from "@/components/app/form/new-transaction/Note"
import {IonAddCircle, IonChevronForward} from "@/components/icons/ion"
import {MatWallet} from "@/components/icons/mat"
import {CalendarToday, SquareRounded} from "@/components/icons/others"

export default function NewTrasactionForm({
  afterSubmit,
}: {
  afterSubmit?: () => void
}) {
  const {
    form: {handleSubmit},
  } = useFormContext()

  const onSubmit = (data: NewTransactionSchemaType) => {
    console.log(data)
    afterSubmit?.()
  }

  const renameMe: {
    icon: ReactNode
    label: string
    value?: string
    children: ReactNode
  }[][] = [
    [
      {
        icon: <CalendarToday />,
        label: "Date",
        value: "Today",
        children: <p>Choose Date</p>,
      },
      {
        icon: <SquareRounded className="[&]:text-ios-teal" />,
        label: "Category",
        value: "Groceries",
        children: <p>Choose category</p>,
      },
      {
        icon: <IonAddCircle />,
        label: "Note",
        children: <Note />,
      },
    ],
    [
      {
        icon: <MatWallet />,
        label: "Account",
        value: "Cash",
        children: <p>Change account</p>,
      },
    ],
  ]

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <AmountInput />

      {renameMe.map((node, j) => {
        const isLastNode = j === node.length
        return (
          <List.Root
            key={j}
            noSpacing={isLastNode}
            className={cn(isLastNode && "mb-8")}
            asChild
          >
            <div>
              {node.map(({label, icon, value, children: child}, k) => (
                <DrawerNested key={k}>
                  <DrawerTrigger asChild>
                    <List.Item asChild>
                      <RacButton className="w-full">
                        <List.Icon className="text-label-secondary" asChild>
                          {icon}
                        </List.Icon>
                        <List.Content>
                          <List.Text>{label}</List.Text>
                          <div className="[&_svg]:text-label-secondary inline-flex flex-row-reverse items-center gap-1">
                            <IonChevronForward />
                            {value && <List.Text level="1">{value}</List.Text>}
                          </div>
                        </List.Content>
                      </RacButton>
                    </List.Item>
                  </DrawerTrigger>
                  <DrawerContent>{children}</DrawerContent>
                </DrawerNested>
              ))}
            </div>
          </List.Root>
        )
      })}

      <Button className="rounded-2xl" variant="filled" fullWidth type="submit">
        Save
      </Button>
    </Form>
  )
}
