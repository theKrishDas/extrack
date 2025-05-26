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
import {Container} from "@/components/layout/container"

// TODO: Add a generic type for this
const data = {
  header: ["Key", "value"],
  body: [
    ["amount", 5000],
    ["Date", "Today"],
    ["Category", "Groceries"],
    ["Note", "Empty"],
  ],
}

export default function InfoTable() {
  return (
    <Container className="bg-fill-quaternary col flex flex-col gap-4 rounded-3xl">
      <Table
        aria-label="Transaction Details"
        selectionMode="none"
        className="w-full"
      >
        <TableHeader className="sr-onlys">
          {data.header.map((header, idx) => (
            <Column key={header} isRowHeader={idx === 0} className="sr-only">
              {header}
            </Column>
          ))}
        </TableHeader>
        <TableBody className="grid-col-1 grid gap-1 p-3">
          {data.body.map((row, j) => (
            <Row
              key={j}
              style={{
                gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              }}
            >
              {row.map((cell, k) => (
                <Cell key={k}>{cell}</Cell>
              ))}
            </Row>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

const Row = <T extends object>({children, className, ...rest}: RowProps<T>) => {
  return (
    <RacRow
      className={cn("border-separator-non-opaque grid border-t-1", className)}
      {...rest}
    >
      {children}
    </RacRow>
  )
}

const Cell = ({children, className, ...rest}: CellProps) => {
  return (
    <RacCell
      className={cn("text-label-primary py-3 font-bold", className)}
      {...rest}
    >
      {children}
    </RacCell>
  )
}
