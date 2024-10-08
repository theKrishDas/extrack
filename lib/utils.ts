import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//  TODO: Localize these variables in future
export const LOCALE = "en-IN" as const;
export const TIMEZONE = "Asia/Kolkata" as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function formatCurrency(amount: number) {
  const format = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const formattedCurrency = format.format(amount);

  return formattedCurrency;
}

export function formatDate(
  date: Date | string,
  monthLength: "long" | "short" = "short",
  showYear: boolean = false,
) {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIMEZONE,
    day: "numeric",
    month: monthLength,
    ...(showYear && { year: "numeric" }), // Include 'year' only if showYear is true
  }).format(new Date(date));
}

export function toNormalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
