/** Minimum amounts Paycrest accepts for an accurate sell-side rate quote. */
const MIN_RATE_QUOTE_AMOUNTS: Record<string, number> = {
  cngn: 1000,
};

export function getMinRateQuoteAmount(tokenSymbol?: string): number {
  const key = tokenSymbol?.trim().toLowerCase() ?? "";
  return MIN_RATE_QUOTE_AMOUNTS[key] ?? 1;
}

/**
 * Resolves the amount sent to Paycrest for a rate quote.
 * Uses the entered amount when above the token minimum, otherwise the minimum.
 */
export function resolveRateQuoteAmount(
  tokenSymbol: string | undefined,
  enteredAmountRaw: string,
): number {
  const minAmount = getMinRateQuoteAmount(tokenSymbol);
  const parsed = Number(enteredAmountRaw.trim());

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return minAmount;
  }

  return Math.max(parsed, minAmount);
}
