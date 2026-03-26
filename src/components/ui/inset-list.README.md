# InsetList

`InsetList` renders grouped inset rows with semantic defaults and optional `asChild` composition.

Use it for settings-style sections, selectable rows, and light wrappers around `react-aria-components` collections.

## Import

```tsx
import { InsetList } from "@/components/ui/inset-list"
```

## API

### Structure

```tsx
<InsetList.Root>
  <InsetList.Section asChild>
    <section>
      <InsetList.SectionHeader>
        <InsetList.SectionTitle />
        <InsetList.SectionDescription />
      </InsetList.SectionHeader>

      <ul className="InsetListSectionItems">
        <InsetList.Item>
          <InsetList.ItemLeading />
          <InsetList.ItemContent>
            <InsetList.ItemBody>
              <InsetList.ItemTitle />
              <InsetList.ItemSubtitle />
            </InsetList.ItemBody>
            <InsetList.ItemTrailing />
          </InsetList.ItemContent>
        </InsetList.Item>
      </ul>

      <InsetList.SectionFooter>
        <InsetList.SectionDescription />
      </InsetList.SectionFooter>
    </section>
  </InsetList.Section>
</InsetList.Root>
```

### Components

| Component | Purpose |
| --- | --- |
| `Root` | Top-level list container. |
| `Section` | Groups rows and renders semantic `section > ul` by default. Use `asChild` when you need custom siblings around the list. |
| `SectionHeader` | Optional section heading wrapper. Supports `visuallyHidden`. |
| `SectionTitle` | Heading text for a section. |
| `SectionDescription` | Secondary section text. Can be used in header or footer. |
| `SectionFooter` | Optional helper text area below a section. |
| `Item` | A single row. Supports `align`, `showSeparator`, and `asChild`. |
| `ItemLeading` | Leading slot. Separator does not render under this area. |
| `ItemContent` | Wrapper for `ItemBody` and `ItemTrailing`. Owns the separator. |
| `ItemBody` | Main content slot. |
| `ItemTitle` | Primary row text. |
| `ItemSubtitle` | Secondary in-row text. |
| `ItemTrailing` | Trailing slot. |
| `ItemMedia` | Framed visual media. Supports `size` and `variant`. |

### Props

#### `InsetList.Root`

- `asChild?: boolean`

#### `InsetList.Section`

- `asChild?: boolean`

#### `InsetList.SectionHeader`

- `asChild?: boolean`
- `visuallyHidden?: boolean`

#### `InsetList.Item`

- `asChild?: boolean`
- `align?: "start" | "center" | "end"`
- `showSeparator?: boolean`

#### `InsetList.ItemContent`

- standard `div` props

#### `InsetList.ItemMedia`

- `size?: "regular" | "tall"`
- `variant?: "fill" | "rounded" | "symbol"`

## Example

```tsx
import { Link } from "react-aria-components"
import { InsetList } from "@/components/ui/inset-list"

export function SettingsList() {
  return (
    <InsetList.Root>
      <InsetList.Section asChild>
        <section>
          <InsetList.SectionHeader>
            <InsetList.SectionTitle>Appearance</InsetList.SectionTitle>
          </InsetList.SectionHeader>

          <ul className="InsetListSectionItems">
            <InsetList.Item asChild>
              <Link className="data-pressed:bg-fill-tertiary" href="/settings/theme">
                <InsetList.ItemLeading>
                  <InsetList.ItemMedia className="bg-indigo-500" variant="rounded">
                    <span className="text-white">􀆸</span>
                  </InsetList.ItemMedia>
                </InsetList.ItemLeading>

                <InsetList.ItemContent>
                  <InsetList.ItemBody>
                    <InsetList.ItemTitle>Theme</InsetList.ItemTitle>
                    <InsetList.ItemSubtitle>System</InsetList.ItemSubtitle>
                  </InsetList.ItemBody>

                  <InsetList.ItemTrailing>
                    <span className="text-label-secondary">􀆊</span>
                  </InsetList.ItemTrailing>
                </InsetList.ItemContent>
              </Link>
            </InsetList.Item>
          </ul>

          <InsetList.SectionFooter>
            <InsetList.SectionDescription>
              Controls the app appearance.
            </InsetList.SectionDescription>
          </InsetList.SectionFooter>
        </section>
      </InsetList.Section>
    </InsetList.Root>
  )
}
```

## React Aria Components

Use `asChild` to let React Aria own the collection markup while `InsetList` provides layout and styling.

```tsx
import {
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "react-aria-components"
import { InsetList } from "@/components/ui/inset-list"

export function AccountListBox() {
  return (
    <InsetList.Root asChild>
      <ListBox aria-label="Accounts">
        <InsetList.Section asChild>
          <ListBoxSection>
            <InsetList.SectionHeader asChild visuallyHidden>
              <Header>
                <InsetList.SectionTitle>Accounts</InsetList.SectionTitle>
              </Header>
            </InsetList.SectionHeader>

            <InsetList.Item asChild>
              <ListBoxItem id="checking">
                <InsetList.ItemLeading>
                  <InsetList.ItemMedia variant="symbol">􀉉</InsetList.ItemMedia>
                </InsetList.ItemLeading>
                <InsetList.ItemContent>
                  <InsetList.ItemBody>
                    <InsetList.ItemTitle>Checking</InsetList.ItemTitle>
                  </InsetList.ItemBody>
                  <InsetList.ItemTrailing>
                    <span className="text-label-secondary">$1,240</span>
                  </InsetList.ItemTrailing>
                </InsetList.ItemContent>
              </ListBoxItem>
            </InsetList.Item>
          </ListBoxSection>
        </InsetList.Section>
      </ListBox>
    </InsetList.Root>
  )
}
```

## Notes

- `showSeparator` always overrides automatic separator behavior.
- `ItemContent` should wrap `ItemBody` and `ItemTrailing`.
- The separator renders under `ItemBody` and `ItemTrailing`, but not `ItemLeading`.
- `ItemMedia` can be used in either leading or trailing slots.
- When composing with `ListBoxItem`, do not place interactive children inside the row.
