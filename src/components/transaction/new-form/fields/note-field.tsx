import { Input, Label, TextField } from "react-aria-components"
import { cn } from "tailwind-variants"
import { useFieldContext } from "../hooks/form-context"

export function NoteField(props: { label: string; placeholder: string }) {
  const field = useFieldContext<string>()
  const { label, placeholder } = props

  return (
    <TextField
      className="flex w-full items-center gap-3"
      isInvalid={!field.state.meta.isValid}
      name={field.name}
      onBlur={field.handleBlur}
      onChange={field.handleChange}
      value={field.state.value}
    >
      <Label className="sr-only">{label}</Label>
      <Input
        className={cn(
          "w-full truncate text-center text-label-secondary text-xl leading-none tracking-[0.015em] placeholder-label-tertiary",
          "outline-none data-focus-visible:rounded-xl data-focus-visible:ring-4 data-focus-visible:ring-ios-blue/(--separator-non-opaque-opacity)"
        )}
        placeholder={placeholder}
      />
    </TextField>
  )
}
