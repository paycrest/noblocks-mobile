import { QUERY_STALE_TIME_MS } from "@/api/queryConstants";
import {
  fetchPaycrestCurrencies,
  getFlagURI,
  type PaycrestCurrency,
} from "@/api/queryFns";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

// ---------------------------------------------------------------------------
// Country code map — used to resolve a flag image URI from CDN
// ---------------------------------------------------------------------------
export { getFlagURI };

interface UseFiatCurrenciesResult {
  currencies: PaycrestCurrency[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

interface UseFiatCurrenciesOptions {
  enabled?: boolean;
}

function getFiatCurrenciesErrorMessage(error: unknown) {
  if (!error) {
    return null;
  }
  return "Unable to load currencies right now. Please try again.";
}

const useFiatCurrencies = ({
  enabled = false,
}: UseFiatCurrenciesOptions = {}): UseFiatCurrenciesResult => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["paycrest", "currencies"],
    queryFn: fetchPaycrestCurrencies,
    enabled,
    staleTime: QUERY_STALE_TIME_MS,
    gcTime: QUERY_STALE_TIME_MS,
    retry: false,
  });

  const refresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    currencies: data ?? [],
    isLoading: isLoading || isFetching,
    error: getFiatCurrenciesErrorMessage(error),
    refresh,
  };
};

export default useFiatCurrencies;
