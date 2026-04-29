import { Colors } from "@/constants/Colors";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: any[]) => twMerge(clsx(inputs));

export const formatNumbers = (num?: number | string) => {
  return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "";
};

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
  let num = typeof amount === "number" ? amount : parseFloat(amount);
  if (isNaN(num)) num = 0;
  const formattedAmount = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${symbol}${formattedAmount}`;
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
