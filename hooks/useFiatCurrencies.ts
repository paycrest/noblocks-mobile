import { get } from "@/api/apiClient";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Country code map — used to resolve a flag image URI from CDN
// ---------------------------------------------------------------------------
const CURRENCY_FLAG_MAP: Record<string, string> = {
  NGN: "ng",
  KES: "ke",
  UGX: "ug",
  TZS: "tz",
  MWK: "mw",
  BRL: "br",
  GHS: "gh",
  ZAR: "za",
  XOF: "sn",
  USD: "us",
  GBP: "gb",
  EUR: "eu",
  ARS: "ar",
};

export const getFlagURI = (currencyCode: string) => {
  const countryCode = CURRENCY_FLAG_MAP[currencyCode.toUpperCase()];
  if (!countryCode) return undefined;
  return `https://flagcdn.com/w80/${countryCode}.png`;
};

// ---------------------------------------------------------------------------
// API shape from GET /currencies
// ---------------------------------------------------------------------------
export interface PaycrestCurrency {
  code: string;
  name: string;
  shortName: string;
  decimals: number;
  symbol: string;
  marketBuyRate: string;
  marketSellRate: string;
  /** Resolved locally — not from API */
  logoURI?: string;
}

interface CurrenciesApiResponse {
  status: string;
  message: string;
  data: Omit<PaycrestCurrency, "logoURI">[];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseFiatCurrenciesResult {
  currencies: PaycrestCurrency[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const useFiatCurrencies = (): UseFiatCurrenciesResult => {
  const [currencies, setCurrencies] = useState<PaycrestCurrency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchCurrencies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await get<CurrenciesApiResponse>("/currencies");

        if (cancelled) return;

        const enriched = (response.data ?? []).map((currency) => ({
          ...currency,
          logoURI: getFlagURI(currency.code),
        }));

        setCurrencies(enriched);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load currencies. Please try again.";
        setError(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCurrencies();

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refresh = () => setTick((prev) => prev + 1);

  return { currencies, isLoading, error, refresh };
};

export default useFiatCurrencies;
