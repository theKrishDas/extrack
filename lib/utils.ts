import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const LOCALE = "en-IN";

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

export function formatDate(date: Date | string) {
  const formattedDate = new Date(date).toLocaleDateString(LOCALE, {
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

export function toNormalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
