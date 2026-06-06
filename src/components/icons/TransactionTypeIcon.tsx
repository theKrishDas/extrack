import type { IconBaseProps, IconType } from "react-icons/lib"
import { MdArrowDownward, MdArrowUpward } from "react-icons/md"
import type { TransactionTypes } from "#lib/constants/transaction-types"

/** Maps each transaction type to its corresponding icon component. */
export const iconMap = {
  expense: MdArrowDownward,
  income: MdArrowUpward,
} satisfies Record<TransactionTypes, IconType>

export interface TransactionTypeIconProps extends IconBaseProps {
  type: TransactionTypes
}

/**
 * Renders the icon associated with a given transaction type.
 * Accepts all `IconBaseProps` (size, color, etc.) via spread.
 */
export function TransactionTypeIcon({
  type,
  ...rest
}: TransactionTypeIconProps) {
  const Icon = iconMap[type]

  return <Icon {...rest} />
}
