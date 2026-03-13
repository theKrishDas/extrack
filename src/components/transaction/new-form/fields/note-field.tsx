import { Input, Label, TextField } from "react-aria-components"
import { cn } from "tailwind-variants"
import { NO_CONSECUTIVE_SPACES, NO_LEADING_SPACE } from "#lib/regex"
import { useFieldContext } from "../hooks/form-context"

export function NoteField(props: { label: string; placeholder: string }) {
  const field = useFieldContext<string | undefined>()
  const { label, placeholder } = props

  return (
    <TextField
      className="flex w-full items-center gap-3"
      isInvalid={!field.state.meta.isValid}
      name={field.name}
      onBlur={field.handleBlur}
      onChange={(value) => {
        field.handleChange(
          value
            .replace(NO_LEADING_SPACE, "") // don't let put space at the beginning
            .replace(NO_CONSECUTIVE_SPACES, " ") // don't let put consecutive spaces
        )
      }}
      validationBehavior="aria"
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
