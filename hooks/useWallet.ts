import { fetchPrivyWalletBalance, type PrivyBalance } from "@/api/queryFns";
import { normalizePrivyAsset, normalizePrivyChain } from "@/utils/privy";
import { useEmbeddedEthereumWallet, usePrivy } from "@privy-io/expo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const DEFAULT_PRIVY_BALANCE_ASSET = "eth";

export interface UseWalletOptions {
  chain?: string;
  asset?: string;
}

const useWallet = ({
  chain = "base",
  asset = DEFAULT_PRIVY_BALANCE_ASSET,
}: UseWalletOptions = {}) => {
  const queryClient = useQueryClient();
  const { wallets } = useEmbeddedEthereumWallet();
  const { user } = usePrivy();
  const walletAddress = wallets?.[0]?.address;
  const walletChain = wallets?.[0]?.chainType;
  const walletId = useMemo(() => {
    if (!walletAddress) {
      return null;
    }

    const linkedWallet = user?.linked_accounts.find((account) => {
      return (
        account.type === "wallet" &&
        account.chain_type === "ethereum" &&
        "id" in account &&
        "connector_type" in account &&
        account.connector_type === "embedded" &&
        account.address.toLowerCase() === walletAddress.toLowerCase()
      );
    });

    if (!linkedWallet || !("id" in linkedWallet)) {
      return null;
    }

    return linkedWallet.id ?? null;
  }, [user?.linked_accounts, walletAddress]);
  const resolvedChain = useMemo(() => normalizePrivyChain(chain), [chain]);
  const resolvedAsset = useMemo(() => normalizePrivyAsset(asset), [asset]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    wallets?.[0]?.getProvider()?.then((provider) => {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          void queryClient.invalidateQueries({ queryKey: ["privy", "wallet"] });
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

  const { data } = useQuery({
    queryKey: ["privy", "wallet", walletId, resolvedChain, resolvedAsset],
    queryFn: async () => {
      if (!walletId || !resolvedChain || !resolvedAsset) {
        return null;
      }

      return fetchPrivyWalletBalance(walletId, {
        chain: resolvedChain,
        asset: resolvedAsset,
      });
    },
    enabled: Boolean(walletId && resolvedChain && resolvedAsset),
  });

  const walletBalance = data?.balances ?? null;

  return {
    asset: resolvedAsset ?? asset,
    chain: resolvedChain ?? chain,
    isAssetSupported: Boolean(resolvedAsset),
    isChainSupported: Boolean(resolvedChain),
    walletId,
    walletAddress,
    walletBalance,
  };
};

export default useWallet;
