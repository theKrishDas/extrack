"use client"

import {Fragment} from "react"
import {Input, Label, NumberField, Text} from "react-aria-components"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button/animated-button"
import {List} from "@/components/ui/list"
import {IonAddCircle, IonChevronForward} from "@/components/icons/ion"
import {MatWallet} from "@/components/icons/mat"
import {CalendarToday, SquareRounded} from "@/components/icons/others"

export default function NewTrasactionForm() {
  return (
    <div>
      <NumberField name="amount" minValue={0.1} isRequired className="relative">
        {({state: {numberValue}}) => {
          return (
            <Fragment>
              <Label className="sr-only">Amount</Label>
              <Input
                className={cn(
                  "text-label-primary/90 h-55 w-full text-center text-7xl font-bold tracking-tight outline-none",
                  "data-[focus-visible]:ring-ios-blue/[var(--separator-non-opaque-opacity)] data-[focus-visible]:rounded-xl data-[focus-visible]:ring-4",
                  numberValue > 999_999 && "text-5xl",
                  numberValue > 99_999_999 && "text-3xl"
                )}
                placeholder="0"
              />
              <Text slot="description" className="sr-only">
                Minimum transaction amount is 0.1
              </Text>
            </Fragment>
          )
        }}
      </NumberField>

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

      <Button className="rounded-2xl" variant="filled" fullWidth>
        Save
      </Button>
    </div>
  )
}
