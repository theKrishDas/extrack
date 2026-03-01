# New Transaction Form Component

## Overview

A form component for creating new transactions (income or expense). Uses TanStack Form for validation and Convex for async default values. The form accepts a transaction type prop to determine whether it's an income or expense transaction.

## Directory Structure

```
new-form/
├── fields/           # Individual form field components
│   ├── amount-field.tsx
│   ├── category-field.tsx
│   ├── date-field.tsx
│   ├── date-popover.tsx
│   └── note-field.tsx
├── hooks/            # Form-specific hooks and context
│   └── form-context.ts
├── schema/           # Validation schema
│   └── index.tsx
├── index.tsx         # Main form component
└── README.md         # This documentation
```

## Form Fields

| Field    | Required | Default                        |
| -------- | -------- | ------------------------------ |
| Amount   | true     | -                              |
| Note     | false    | -                              |
| Category | true     | Last used for transaction type |
| Date     | true     | Current date/time              |
| Account  | true     | User's default account         |
| Type     | true     | Passed via props               |

## Key Features

- Client-side validation using TanStack Form
- Async default value loading from Convex (account & category)
- Accessible form fields with React Aria Components
- Toast notifications on submission
- Keyboard navigation support via Toolbar

## Error Display Reference

To render form validation errors, subscribe to the form's error state:

```tsx
<form.Subscribe selector={(state) => [state.errorMap]}>
  {([errorMap]) => {
    const errors = errorMap.onChange;
    if (!errors) return null;

    const messages = Object.values(errors)
      .flat()
      .map((e) => e.message);

    return (
      <ul className="align-middle text-ios-red [&>li>span]:first:font-semibold [&>li>span]:first:text-[0.9em] [&>li]:flex [&>li]:items-center [&>li]:gap-1 [&>li]:ps-1">
        {messages.map((m) => (
          <li key={m}>
            <span aria-hidden={true}>􀆄</span>
            {m}
          </li>
        ))}
      </ul>
    );
  }}
</form.Subscribe>
```

This subscribes to `errorMap.onChange`, extracts all error messages, and displays them in a styled list.

