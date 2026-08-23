import { fetchEvmWalletBalances } from "@/lib/wallet/balances";
import { resolveNetwork } from "@/lib/wallet/networks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useEffect } from "react";
import { useWalletAddress } from "@/hooks/useWalletAddress";

const BALANCE_STALE_TIME_MS = 30_000;

export function useWalletBalances(chainKey = "base") {
  const queryClient = useQueryClient();
  const walletAddress = useWalletAddress();
  const { wallets } = useEmbeddedEthereumWallet();
  const { displayName, chain } = resolveNetwork(chainKey);

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

  const query = useQuery({
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
  });

  return {
    walletAddress,
    chainName: displayName,
    chainId: chain.id,
    balances: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
