# `useControllableState`

Manages state that can be either controlled (caller-owned) or uncontrolled (internally owned) — the same pattern used by native form elements and component libraries like Radix UI.

## Signature

```ts
function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void];
```

## Parameters

| Parameter         | Type                 | Required | Description                                                              |
| ----------------- | -------------------- | -------- | ------------------------------------------------------------------------ |
| `controlledValue` | `T \| undefined`     | Yes      | Pass the controlled value, or `undefined` to use uncontrolled mode.      |
| `defaultValue`    | `T`                  | Yes      | Initial value used when uncontrolled. Ignored after first render.        |
| `onChange`        | `(value: T) => void` | No       | Called on every state change regardless of controlled/uncontrolled mode. |

## Returns

`[value, setValue]` — the resolved current value and a stable setter.

## Behavior

| Scenario                                       | `value` source         | `setInternalValue` called | `onChange` called |
| ---------------------------------------------- | ---------------------- | ------------------------- | ----------------- |
| Uncontrolled (`controlledValue === undefined`) | internal state         | Yes                       | Yes               |
| Controlled (`controlledValue !== undefined`)   | `controlledValue` prop | No                        | Yes               |

`onChange` is always called — it acts as an observer, not a state driver.

## Usage

### Uncontrolled (internal state)

```tsx
function Disclosure() {
  const [open, setOpen] = useControllableState(undefined, false);
  return (
    <button onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}</button>
  );
}
```

### Controlled (caller owns state)

```tsx
function Disclosure({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [value, setValue] = useControllableState(open, false, onOpenChange);
  return (
    <button onClick={() => setValue(!value)}>{value ? "Close" : "Open"}</button>
  );
}
```

### Exposing both modes to consumers (recommended pattern)

```tsx
type DisclosureProps = {
  open?: boolean; // omit for uncontrolled
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Disclosure({
  open,
  defaultOpen = false,
  onOpenChange,
}: DisclosureProps) {
  const [value, setValue] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  // ...
}
```

## Notes

- Detection is `controlledValue !== undefined` — passing `null`, `0`, `false`, or `""` counts as controlled.
- `defaultValue` only seeds the initial internal state. Changing it after mount has no effect.
- The setter is memoized via `useCallback`; its reference only changes when `isControlled` or `onChange` changes.
- Switching between controlled and uncontrolled modes after mount is supported but not recommended. Once a component decides to be controlled or uncontrolled, it should remain in that mode for its lifetime.

> `null` is treated as a controlled value (`null !== undefined`), not as "reset to uncontrolled." If you want uncontrolled mode, pass `undefined` explicitly.
