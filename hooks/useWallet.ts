import { normalizePrivyAsset, normalizePrivyChain } from "@/utils/privy";
import { useEmbeddedEthereumWallet, usePrivy } from "@privy-io/expo";
import { useEffect, useMemo, useState } from "react";

const PRIVY_BASE_URL = process.env.EXPO_PUBLIC_PRIVY_BASE_URL;
const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.EXPO_PUBLIC_PRIVY_APP_SECRET!;
const DEFAULT_PRIVY_BALANCE_ASSET = "eth";

function privyAuthHeader() {
  const encoded = btoa(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`);
  return {
    Authorization: `Basic ${encoded}`,
    "privy-app-id": PRIVY_APP_ID,
  };
}

export interface PrivyBalance {
  chain: string; // e.g. "base"
  asset: string; // e.g. "eth"
  raw_value: string; // e.g. "1000000000000000000"
  raw_value_decimals: number; // e.g. 18
  display_values?: {
    eth?: string;
    usd?: string;
    [symbol: string]: string | undefined;
  };
}

export interface GetBalanceResponse {
  balances: PrivyBalance[];
}

export interface UseWalletOptions {
  chain?: string;
  asset?: string;
}

const useWallet = ({
  chain = "base",
  asset = DEFAULT_PRIVY_BALANCE_ASSET,
}: UseWalletOptions = {}) => {
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
  const [walletBalance, setWalletBalance] = useState<PrivyBalance[] | null>(
    null,
  );
  const resolvedChain = useMemo(() => normalizePrivyChain(chain), [chain]);
  const resolvedAsset = useMemo(() => normalizePrivyAsset(asset), [asset]);

  wallets?.[0]?.getProvider()?.then((provider) => {
    provider.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletBalance(null);
      }
    });
  });

  useEffect(() => {
    if (!walletId) {
      setWalletBalance(null);
      return;
    }

    if (!resolvedChain) {
      setWalletBalance(null);
      return;
    }

    if (!resolvedAsset) {
      setWalletBalance(null);
      return;
    }

    getWalletBalance(walletId, { chain: resolvedChain, asset: resolvedAsset })
      .then((res) => {
        setWalletBalance(res.balances);
      })
      .catch((err) => {
        console.error("Failed to fetch wallet balance", err);
      });
  }, [resolvedAsset, resolvedChain, walletChain, walletId]);

  const getWalletBalance = async (
    walletId: string,
    balanceOptions: Required<UseWalletOptions>,
  ): Promise<GetBalanceResponse> => {
    const params = new URLSearchParams({
      chain: balanceOptions.chain,
      asset: balanceOptions.asset,
    });
    const url = `${PRIVY_BASE_URL}/wallets/${walletId}/balance?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...privyAuthHeader(),
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Privy get balance failed (${res.status}): ${text}`);
    }
    return (await res.json()) as GetBalanceResponse;
  };

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
