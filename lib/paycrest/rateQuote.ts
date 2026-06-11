/** Minimum amounts Paycrest accepts for an accurate sell-side rate quote. */
import { parseAmountValue } from "@/utils/general";

const MIN_RATE_QUOTE_AMOUNTS: Record<string, number> = {
  cngn: 1000,
};

export function getMinRateQuoteAmount(tokenSymbol?: string): number {
  const key = tokenSymbol?.trim().toLowerCase() ?? "";
  return MIN_RATE_QUOTE_AMOUNTS[key] ?? 1;
}

/** Amount sent to Paycrest for the displayed unit rate (independent of user input). */
export function getReferenceRateQuoteAmount(tokenSymbol?: string): number {
  return getMinRateQuoteAmount(tokenSymbol);
}

/**
 * Resolves entered amount for fiat estimates and order submission.
 */
export function resolveRateQuoteAmount(
  tokenSymbol: string | undefined,
  enteredAmountRaw: string,
): number {
  const minAmount = getMinRateQuoteAmount(tokenSymbol);
  const parsed = parseAmountValue(enteredAmountRaw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return minAmount;
  }

  return Math.max(parsed, minAmount);
}
