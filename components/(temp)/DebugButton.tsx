import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";
import { SVGProps } from "react";

// TODO: Export this variable from @/lib/defaultValues
const LOCALE = "en-IN";
const TIMEZONE = "Asia/Kolkata";

export default function DebugButton({
  transaction,
}: {
  transaction: transactionSchemaType;
}) {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="debug-transaction-button absolute bottom-20 right-5 h-14 w-14 rounded-none bg-yellow-100 text-lg text-yellow-700"
            variant="ghost"
          >
            <MaterialSymbolsBugReportOutlineRounded />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-5">
          <DisplayField title="Id" value={convertUUID(transaction.id)} />
          <DisplayField title="Amount" value={transaction.amount} />
          <DisplayField title="Title" value={transaction.label || "--"} />
          <DisplayField
            title="INTL"
            value={convertToIndiaTime(transaction.date)}
          />
          <DisplayField title="Locale" value={formatDate(transaction.date)} />
        </PopoverContent>
      </Popover>
    </>
  );
}

function DisplayField({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <p className="max-w-[20ch] truncate">
      <span className="font-bold">{title}</span>:
      <span className=""> {value}</span>
    </p>
  );
}

function convertToIndiaTime(date: Date | string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "short",
    timeZone: TIMEZONE,
  }).format(new Date(date));
}

function convertUUID(uuid: string) {
  const firstPart = uuid.slice(0, 4);
  const lastPart = uuid.slice(-4);
  return `${firstPart}***${lastPart}`;
}

export function MaterialSymbolsBugReportOutlineRounded(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 21q-1.625 0-3.012-.8T6.8 18H5q-.425 0-.712-.288T4 17t.288-.712T5 16h1.1q-.075-.5-.088-1T6 14H5q-.425 0-.713-.288T4 13t.288-.712T5 12h1q0-.5.013-1t.087-1H5q-.425 0-.712-.288T4 9t.288-.712T5 8h1.8q.35-.575.788-1.075T8.6 6.05l-.925-.95Q7.4 4.825 7.4 4.413t.3-.713q.275-.275.7-.275t.7.275l1.45 1.45q.7-.225 1.425-.225t1.425.225l1.5-1.475q.275-.275.687-.275t.713.3q.275.275.275.7t-.275.7l-.95.95q.575.375 1.037.863T17.2 8H19q.425 0 .713.288T20 9t-.288.713T19 10h-1.1q.075.5.088 1T18 12h1q.425 0 .712.288T20 13t-.288.713T19 14h-1q0 .5-.012 1t-.088 1H19q.425 0 .713.288T20 17t-.288.713T19 18h-1.8q-.8 1.4-2.187 2.2T12 21m0-2q1.65 0 2.825-1.175T16 15v-4q0-1.65-1.175-2.825T12 7T9.175 8.175T8 11v4q0 1.65 1.175 2.825T12 19m-1-3h2q.425 0 .713-.288T14 15t-.288-.712T13 14h-2q-.425 0-.712.288T10 15t.288.713T11 16m0-4h2q.425 0 .713-.288T14 11t-.288-.712T13 10h-2q-.425 0-.712.288T10 11t.288.713T11 12m1 1"
      ></path>
    </svg>
  );
}
