# Transaction List State Flow

```mermaid
graph TD
    A["TransactionList Component"]

    A -->|"1 · renders"| B["Virtualized ListBox"]
    A -->|"owns state"| S1["activeTxn: Transaction | null"]
    A -->|"owns state"| S2["open: boolean"]

    B -->|"renders one per transaction"| C["ListBoxItem"]

    C -->|"2 · user clicks"| D["onPress handler"]

    D -->|"3 · setActiveTxn(transaction)"| S1
    D -->|"3 · setOpen(true)"| S2

    S1 -->|"4 · passed as prop"| E["Drawer Component"]
    S2 -->|"4 · passed as prop"| E

    E -->|"5 · renders when open=true"| F["Transaction Detail View"]

    style S1 fill:#e1f5ff,color:#0066aa
    style S2 fill:#e1f5ff,color:#0066aa
    style D fill:#fff4e1,color:#996600
    style F fill:#e8f5e9,color:#2e7d32
```

# TransactionList

Renders a virtualized list of transactions. Clicking a row opens a Drawer with the transaction's details.

## How it works

State lives in `TransactionList` and is passed down as props:

| State       | Type         | Purpose                    |
| ----------- | ------------ | -------------------------- | ------------------------ |
| `activeTxn` | `Transaction | null`                      | The selected transaction |
| `open`      | `boolean`    | Controls drawer visibility |

When a list item is clicked, `onPress` sets both `activeTxn` (the full transaction object) and `open: true`. The Drawer reads these as props and renders the detail view.

## Why store the full transaction object?

Storing the full object instead of just an ID avoids an O(n) `.find()` lookup and handles pagination gracefully — the selected transaction stays available even if it scrolls out of the current page.

## Why props instead of context?

The API isn't finalized yet. Lifting state up and passing props keeps things simple and explicit — no `Drawer.Provider` wrapper, no context, no overengineering. Easy to refactor later once the API is settled.
