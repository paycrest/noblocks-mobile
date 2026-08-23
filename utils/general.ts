import { Colors } from "@/constants/Colors";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: any[]) => twMerge(clsx(inputs));

export const MAX_DISPLAY_DECIMALS = 2;

const formatIntegerWithCommas = (value: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatNumbers = (num?: number | string) => {
  if (num === undefined || num === null || num === "") {
    return "";
  }

  const raw = num.toString().replace(/,/g, "");
  const [integerPart = "", ...rest] = raw.split(".");
  const decimalPart = rest.join(".");
  const formattedInteger =
    integerPart === "" ? "0" : formatIntegerWithCommas(integerPart);

  if (raw.includes(".")) {
    return decimalPart.length > 0
      ? `${formattedInteger}.${decimalPart}`
      : `${formattedInteger}.`;
  }

  return formattedInteger;
};

export function sanitizeAmountInput(value: string): string {
  return value.replace(/,/g, "");
}

export function parseAmountValue(
  value: string | number | null | undefined,
): number {
  if (value === null || value === undefined || value === "") {
    return Number.NaN;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  const sanitized = value.trim().replace(/,/g, "");
  if (!sanitized || sanitized === ".") {
    return Number.NaN;
  }

  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function formatCurrencyAmount(
  value: number | string | null | undefined,
  options?: { maximumFractionDigits?: number },
): string {
  const maximumFractionDigits =
    options?.maximumFractionDigits ?? MAX_DISPLAY_DECIMALS;

  if (value === null || value === undefined || value === "") {
    return "0";
  }

  if (typeof value === "string") {
    const sanitized = value.replace(/,/g, "").trim();
    if (!sanitized) {
      return "0";
    }

    if (sanitized.endsWith(".")) {
      const whole = sanitized.slice(0, -1);
      return whole ? `${formatNumbers(whole)}.` : "0.";
    }

    const parsed = Number.parseFloat(sanitized);
    if (!Number.isFinite(parsed)) {
      return formatNumbers(sanitized) || "0";
    }
  }

  const numericValue =
    typeof value === "number"
      ? value
      : Number.parseFloat(String(value).replace(/,/g, ""));

  if (!Number.isFinite(numericValue)) {
    return "0";
  }

  return numericValue.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

export function formatAmountLabel(
  amount?: string | number | null,
  token?: string | null,
): string {
  const trimmedAmount =
    typeof amount === "number"
      ? formatCurrencyAmount(amount)
      : amount?.trim()
        ? formatCurrencyAmount(amount)
        : "";
  const trimmedToken = token?.trim();

  if (trimmedAmount && trimmedToken) {
    return `${trimmedAmount} ${trimmedToken}`;
  }

  if (trimmedAmount) {
    return trimmedAmount;
  }

  return "--";
}

export function truncateDecimalPlaces(
  value: string | number,
  maxFractionDigits = MAX_DISPLAY_DECIMALS,
): string {
  const sanitized = String(value).replace(/,/g, "").trim();
  if (!sanitized.includes(".")) {
    return sanitized;
  }

  const [whole, fraction = ""] = sanitized.split(".");
  const trimmedFraction = fraction.slice(0, maxFractionDigits);
  return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : whole;
}

/** Floors a numeric amount to a max number of decimal places (never rounds up). */
export function floorDecimalPlaces(
  value: number,
  maxFractionDigits = MAX_DISPLAY_DECIMALS,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const factor = 10 ** maxFractionDigits;
  return Math.floor(value * factor + 1e-9) / factor;
}

/** Formats token balances for display, flooring so shown amounts never exceed on-chain balance. */
export function formatFlooredAmount(
  value: number,
  maxFractionDigits = MAX_DISPLAY_DECIMALS,
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const floored = floorDecimalPlaces(value, maxFractionDigits);
  const fixed = floored.toFixed(maxFractionDigits);
  return formatNumbers(truncateDecimalPlaces(fixed, maxFractionDigits));
}

export function formatCurrencyWithCode(
  code: string | undefined,
  amount?: string | number | null,
  fallback = "0",
): string {
  if (amount === null || amount === undefined || amount === "") {
    return code ? `${code} ${fallback}` : fallback;
  }

  const formatted = formatCurrencyAmount(amount);
  return code ? `${code} ${formatted}` : formatted;
}

export const formatPhoneNumber = (phoneNumberString?: string) => {
  if (!phoneNumberString) {
    return "";
  }
  let phoneNumber = phoneNumberString?.replace(/\D/g, "");

  if (phoneNumber?.length >= 4) {
    phoneNumber =
      phoneNumber?.substring(0, 4) + " " + phoneNumber?.substring(4);
  }
  if (phoneNumber.length >= 8) {
    phoneNumber =
      phoneNumber?.substring(0, 8) + " " + phoneNumber?.substring(8);
  }
  return phoneNumber?.trim();
};

export const parseDigits = (numbers?: string) =>
  numbers?.replace(/\D/g, "") || "";

export const formatWalletAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
};

export const formatAmount = (amount: number | string, symbol: string = "₦") => {
  return `${symbol}${formatCurrencyAmount(amount)}`;
};

export const setTransactionStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return Colors.green;
    case "Ongoing":
      return Colors.light.secondary;
    case "Failed":
      return Colors.destructive;
    default:
      return Colors.light.secondary;
  }
};
