import {
  mergeWalletBalances,
  WALLET_BALANCE_CHAIN_KEYS,
} from "@/lib/wallet/aggregateBalances";
import { fetchEvmWalletBalances } from "@/lib/wallet/balances";
import { resolveNetwork } from "@/lib/wallet/networks";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useEffect, useMemo } from "react";
import { useWalletAddress } from "@/hooks/useWalletAddress";

const BALANCE_STALE_TIME_MS = 30_000;

export function useAggregatedWalletBalances() {
  const queryClient = useQueryClient();
  const walletAddress = useWalletAddress();
  const { wallets } = useEmbeddedEthereumWallet();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    wallets?.[0]?.getProvider()?.then((provider) => {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          void queryClient.invalidateQueries({ queryKey: ["wallet", "balances"] });
        }
      };

      provider.on("accountsChanged", handleAccountsChanged);
      cleanup = () => {
        if (typeof provider.removeListener === "function") {
          provider.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    });

    return () => {
      cleanup?.();
    };
  }, [queryClient, wallets]);

  const queries = useQueries({
    queries: WALLET_BALANCE_CHAIN_KEYS.map((chainKey) => {
      const { chain } = resolveNetwork(chainKey);

      return {
        queryKey: ["wallet", "balances", walletAddress, chain.id],
        queryFn: async () => {
          if (!walletAddress) {
            return null;
          }
          return fetchEvmWalletBalances(chain, walletAddress);
        },
        enabled: Boolean(walletAddress),
        staleTime: BALANCE_STALE_TIME_MS,
        refetchInterval: 60_000,
      };
    }),
  });

  const aggregated = useMemo(() => {
    const chainBalances = queries
      .map((query) => query.data)
      .filter((data): data is NonNullable<typeof data> => Boolean(data));

    if (!chainBalances.length) {
      return null;
    }

    return mergeWalletBalances(chainBalances);
  }, [queries]);

  return {
    walletAddress,
    balances: aggregated,
    isLoading: queries.some((query) => query.isLoading),
    isFetching: queries.some((query) => query.isFetching),
    error: queries.find((query) => query.error)?.error ?? null,
    refetch: () =>
      Promise.all(queries.map((query) => query.refetch())).then(() => undefined),
  };
}
