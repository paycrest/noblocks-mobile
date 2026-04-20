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
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["paycrest", "currencies"],
    queryFn: fetchPaycrestCurrencies,
    staleTime: 5 * 60 * 1000,
  });

  const refresh = () => {
    void refetch();
  };

  return {
    currencies: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
};

export default useFiatCurrencies;
