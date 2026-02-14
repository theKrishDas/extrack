"use client"

import {
  type CellProps,
  Column,
  Cell as RacCell,
  Row as RacRow,
  type RowProps,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components"

import { cn } from "@/lib/utils"

export type DataType = {
  header: string[]
  body: (string | number | undefined)[][]
}

function DataTable({
  data,
  ariaLabel,
  className,
}: {
  data: DataType
  ariaLabel: string | undefined
  className?: string
}) {
  return (
    <Table
      aria-label={ariaLabel}
      className={cn("w-full", className)}
      selectionMode="none"
    >
      <TableHeader className="sr-only">
        {data.header.map((header, idx) => (
          <Column isRowHeader={idx === 0} key={header}>
            {header}
          </Column>
        ))}
      </TableHeader>
      <TableBody className="grid-col-1 grid gap-1">
        {data.body.map((row, j) => (
          <Row
            key={`row-${j}-${row.filter(Boolean).join("-")}`}
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }}
          >
            {row.map((cell, k) => (
              <Cell
                className={cn(!cell && "text-label-quaternary")}
                key={`cell-${j}-${k}-${data.header[k]}`}
              >
                {cell || "Empty"}
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </Table>
  )
}

const Row = <T extends object>({
  children,
  className,
  ...rest
}: RowProps<T>) => {
  return (
    <RacRow
      className={cn(
        "grid gap-2 border-separator-non-opaque border-t",
        className
      )}
      {...rest}
    >
      {children}
    </RacRow>
  )
}

const Cell = ({ children, className, ...rest }: CellProps) => {
  return (
    <RacCell
      className={cn(
        "py-3 font-bold text-label-primary [&:has(+td)]:text-label-secondary",
        className
      )}
      {...rest}
    >
      {children}
    </RacCell>
  )
}

export { DataTable }
