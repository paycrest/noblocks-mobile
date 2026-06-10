import { Colors } from "@/constants/Colors";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: any[]) => twMerge(clsx(inputs));

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

export function formatCurrencyAmount(
  value: number | string | null | undefined,
  options?: { maximumFractionDigits?: number },
): string {
  const maximumFractionDigits = options?.maximumFractionDigits ?? 8;

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

export function formatCurrencyWithCode(
  code: string | undefined,
  amount?: string | number | null,
  fallback = "0",
): string {
  if (amount === null || amount === undefined || amount === "") {
    return code ? `${code} ${fallback}` : fallback;
  }

  const formatted = formatCurrencyAmount(amount, { maximumFractionDigits: 2 });
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
  return `${symbol}${formatCurrencyAmount(amount, { maximumFractionDigits: 2 })}`;
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
