# DynamicDrawer

`ExperimentalDynamicDrawer` renders a drawer with navigable levels and animated content transitions.

Use it for drawer flows that move between related views, such as details, editing, and confirmation screens.

## Import

```tsx
import { ExperimentalDynamicDrawer as DynamicDrawer } from "@/components/ui/drawer/dynamic-drawer";
```

## API

### Structure

```tsx
<DynamicDrawer
  initialLevel="details"
  levels={{
    details: {
      showClose: false,
      title: "Details",
      content: ({ navigate }) => <Details onEdit={() => navigate("edit")} />,
    },
    edit: {
      showClose: true,
      title: "Edit",
      content: ({ back, close }) => <Edit onBack={back} onDone={close} />,
    },
  }}
  trigger={<Button>Open Drawer</Button>}
/>
```

### Props

#### `DynamicDrawer`

| Prop           | Type                        | Description                               |
| -------------- | --------------------------- | ----------------------------------------- |
| `trigger`      | `ReactElement`              | Trigger element to open the drawer        |
| `initialLevel` | `T`                         | Initial level shown when drawer opens     |
| `levels`       | `Record<T, LevelConfig<T>>` | Configuration for different drawer levels |
| `open`         | `boolean`                   | Controlled open state (optional)          |
| `defaultOpen`  | `boolean`                   | Default open state when uncontrolled      |
| `onOpenChange` | `(open: boolean) => void`   | Callback when open state changes          |

#### `LevelConfig`

| Prop         | Type                                           | Description                                     |
| ------------ | ---------------------------------------------- | ----------------------------------------------- |
| `title`      | `string`                                       | Title for the current level                     |
| `content`    | `(props: LevelRenderProps<T>) => ReactElement` | Render function for the current level's content |
| `showClose?` | `boolean`                                      | Optional close button for the level             |

#### `LevelRenderProps`

| Prop       | Type               | Purpose                        |
| ---------- | ------------------ | ------------------------------ |
| `navigate` | `(key: T) => void` | Opens another level.           |
| `back`     | `() => void`       | Returns to the previous level. |
| `close`    | `() => void`       | Closes the drawer.             |

## Example

```tsx
import { ExperimentalDynamicDrawer as DynamicDrawer } from "@/components/ui/drawer/dynamic-drawer";
import { Button } from "@/components/ui/button";

type Level = "details" | "delete";

export function CategoryDrawer() {
  return (
    <DynamicDrawer<Level>
      initialLevel="details"
      levels={{
        details: {
          title: "Groceries",
          content: ({ navigate }) => (
            <div className="p-4">
              <p>Groceries</p>
              <Button onPress={() => navigate("delete")}>Delete</Button>
            </div>
          ),
        },
        delete: {
          title: "Delete Category",
          content: ({ back, close }) => (
            <div className="p-4">
              <p>Delete Groceries?</p>
              <Button onPress={back}>Cancel</Button>
              <Button color="red" onPress={close}>
                Delete
              </Button>
            </div>
          ),
        },
      }}
      trigger={<Button>Open Drawer</Button>}
    />
  );
}
```

## Notes

- This component is experimental. Import it as `DynamicDrawer` at the call site.
- `initialLevel` is shown whenever the drawer opens.
- `title` provides the accessible drawer title.
- `showClose` adds a close button to a level.
- `navigate` opens another level, `back` returns to the previous level, and `close` closes the drawer.
