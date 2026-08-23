import Binance from "@/components/svgs/binance";
import Tether from "@/components/svgs/tether";
import USDC from "@/components/svgs/usdc-icon";
import React from "react";

const TOKEN_ICONS: Record<
  string,
  React.FC<{ width: number; height: number }>
> = {
  USDC,
  USDT: Tether,
  BUSD: Binance,
};

export function getTransactionTokenIcon(token: string) {
  return TOKEN_ICONS[token.trim().toUpperCase()] ?? USDC;
}
