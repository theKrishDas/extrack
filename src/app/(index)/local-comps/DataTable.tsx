"use client"

import {
  CellProps,
  Column,
  Cell as RacCell,
  Row as RacRow,
  RowProps,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components"

import {cn} from "@/lib/utils"

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
          <Column key={header} isRowHeader={idx === 0}>
            {header}
          </Column>
        ))}
      </TableHeader>
      <TableBody className="grid-col-1 grid gap-1">
        {data.body.map((row, j) => (
          <Row
            key={j}
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }}
          >
            {row.map((cell, k) => (
              <Cell key={k} className={cn(!cell && "text-label-quaternary")}>
                {cell || "Empty"}
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </Table>
  )
}

const Row = <T extends object>({children, className, ...rest}: RowProps<T>) => {
  return (
    <RacRow
      className={cn(
        "border-separator-non-opaque grid gap-2 border-t-1",
        className
      )}
      {...rest}
    >
      {children}
    </RacRow>
  )
}

const Cell = ({children, className, ...rest}: CellProps) => {
  return (
    <RacCell
      className={cn(
        "text-label-primary [&:has(+td)]:text-label-secondary py-3 font-bold",
        className
      )}
      {...rest}
    >
      {children}
    </RacCell>
  )
}

export {DataTable}
