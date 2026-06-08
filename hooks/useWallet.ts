import {
  formatTokenAmount,
  weiToDecimalString,
} from "@/lib/wallet/balances";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useMemo } from "react";

export interface UseWalletOptions {
  chain?: string;
  asset?: string;
}

const useWallet = ({
  chain = "base",
  asset = "usdc",
}: UseWalletOptions = {}) => {
  const {
    walletAddress,
    chainName,
    chainId,
    balances,
    isLoading,
    isFetching,
    refetch,
  } = useWalletBalances(chain);

  const resolvedAssetSymbol = useMemo(
    () => asset?.trim().toUpperCase() ?? "USDC",
    [asset],
  );

  const assetBalance = balances?.balances[resolvedAssetSymbol] ?? 0;

  const getBalanceForSymbol = (symbol: string) =>
    balances?.balances[symbol.trim().toUpperCase()] ?? 0;

  const getBalanceLabel = (symbol?: string) => {
    const normalizedSymbol = (symbol ?? resolvedAssetSymbol).trim().toUpperCase();
    const amount = balances?.balances[normalizedSymbol];
    if (amount === undefined) {
      return "--";
    }
    return `${formatTokenAmount(amount)} ${normalizedSymbol}`;
  };

  const getMaxAmount = (symbol?: string, decimals = 18) => {
    const normalizedSymbol = (symbol ?? resolvedAssetSymbol).trim().toUpperCase();
    const raw = balances?.balancesInWei?.[normalizedSymbol];
    if (raw === undefined) {
      return "";
    }
    return weiToDecimalString(raw, decimals);
  };

  return {
    asset,
    chain,
    chainName,
    chainId,
    walletAddress,
    balances,
    assetBalance,
    isLoading,
    isFetching,
    refetch,
    getBalanceForSymbol,
    getBalanceLabel,
    getMaxAmount,
  };
};

export default useWallet;
