import { QUERY_STALE_TIME_MS } from "@/api/queryConstants";
import {
  fetchPaycrestCurrencies,
  getFlagURI,
  type PaycrestCurrency,
} from "@/api/queryFns";
import { useQuery } from "@tanstack/react-query";

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

const useFiatCurrencies = (): UseFiatCurrenciesResult => {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["paycrest", "currencies"],
    queryFn: fetchPaycrestCurrencies,
    enabled: false,
    staleTime: QUERY_STALE_TIME_MS,
    retry: false,
  });

  const refresh = () => {
    void refetch();
  };

  return {
    currencies: data ?? [],
    isLoading: isLoading || isFetching,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};

export default useFiatCurrencies;
