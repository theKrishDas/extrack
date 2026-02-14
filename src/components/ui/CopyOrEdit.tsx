"use client"

import { useRef, useState } from "react"
import { Button, Form, Input, Label, TextField } from "react-aria-components"

import { Button as AnimatedButton } from "@/components/ui/button"

import { IonPencil } from "../icons/ion"

type Modes = "copying" | "editing"
const defaultMode: Modes = "copying" as const

// WARN: DO NOT STYLE THIS COMPONENT
// keep it an unstyled component
function CopyOrEdit() {
  const [mode, setMode] = useState<Modes>(defaultMode)
  const label = "Tap to copy"
  const [editedValue, setEditedValue] = useState(label)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <>
      {mode === "copying" ? (
        <Button /* onPress={copyText(copyText)} */>{editedValue}</Button>
      ) : (
        <Form
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const parsedData = data.get("edit-text")?.toString()
            const isValidData =
              parsedData !== undefined && parsedData.toString().length !== 0

            setEditedValue((v) => (isValidData ? parsedData : v))
            e.currentTarget.reset()
            setMode("copying")
          }}
          ref={formRef}
        >
          <TextField
            autoFocus
            defaultValue={editedValue}
            name="edit-text"
            onFocusChange={(isFocused) => {
              if (!isFocused) {
                formRef.current?.requestSubmit()
                setMode("copying")
              }
            }}
          >
            <Label className="sr-only">First name</Label>
            <Input className="rounded-lg bg-fill-tertiary" />
          </TextField>
        </Form>
      )}

      <AnimatedButton
        isIconOnly
        onPress={() => {
          setMode((v) => (v === "copying" ? "editing" : "copying"))
        }}
        size="sm"
        variant="filled"
      >
        <IonPencil />
      </AnimatedButton>
    </>
  )
}

export { CopyOrEdit }
