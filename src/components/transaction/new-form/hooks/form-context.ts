import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs"
import { AccountField } from "../fields/account-field"
import { AmountField } from "../fields/amount-field"
import { CategoryField } from "../fields/category-field"
import { DateField } from "../fields/date-field"
import { NoteField } from "../fields/note-field"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    AmountField,
    NoteField,
    DateField,
    CategoryField,
    AccountField,
  },
  formComponents: {},
})
