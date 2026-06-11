import { formatCurrencyAmount, parseAmountValue } from "@/utils/general";

const USD_PEGGED_STABLECOIN_SYMBOLS = new Set([
  "USDC",
  "USDT",
  "DAI",
  "BUSD",
  "USDC.E",
  "USDCE",
]);

export function isUsdPeggedStablecoin(symbol?: string | null): boolean {
  const normalized = symbol?.trim().toUpperCase() ?? "";
  return USD_PEGGED_STABLECOIN_SYMBOLS.has(normalized);
}

export type TokenUsdPriceInput = {
  symbol?: string;
  priceUSD?: string | number | null;
  /** Paycrest sell rate: fiat received per 1 token. */
  tokenFiatRate?: number | null;
  /** Paycrest sell rate for USDC to the same fiat. */
  usdcFiatRate?: number | null;
};

/**
 * Resolves the USD price of one token unit.
 * Priority: USD-pegged stables (1:1) → LiFi priceUSD → Paycrest fiat-rate ratio.
 */
export function resolveTokenUsdUnitPrice(
  input: TokenUsdPriceInput,
): number | null {
  if (isUsdPeggedStablecoin(input.symbol)) {
    return 1;
  }

  const lifiPrice = Number(input.priceUSD);
  if (Number.isFinite(lifiPrice) && lifiPrice > 0) {
    return lifiPrice;
  }

  const tokenRate = input.tokenFiatRate;
  const usdcRate = input.usdcFiatRate;
  if (
    tokenRate != null &&
    usdcRate != null &&
    Number.isFinite(tokenRate) &&
    tokenRate > 0 &&
    Number.isFinite(usdcRate) &&
    usdcRate > 0
  ) {
    return tokenRate / usdcRate;
  }

  return null;
}

export function formatTokenUsdEstimate(
  amountRaw: string,
  input: TokenUsdPriceInput,
): string {
  const numericAmount = parseAmountValue(amountRaw);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "0";
  }

  const unitPrice = resolveTokenUsdUnitPrice(input);
  if (unitPrice === null) {
    return "0";
  }

  return formatCurrencyAmount(numericAmount * unitPrice);
}
