import {
  formatTokenAmount,
  getBalanceAmount,
  getBalanceWeiAmount,
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
    () => asset?.trim() || "USDC",
    [asset],
  );

  const assetBalance = getBalanceAmount(balances, resolvedAssetSymbol) ?? 0;

  const getBalanceForSymbol = (symbol: string) =>
    getBalanceAmount(balances, symbol) ?? 0;

  const getBalanceLabel = (symbol?: string) => {
    const targetSymbol = symbol?.trim() || resolvedAssetSymbol;
    const amount = getBalanceAmount(balances, targetSymbol);
    if (amount === undefined) {
      return "--";
    }
    return `${formatTokenAmount(amount)} ${targetSymbol}`;
  };

  const getMaxAmount = (symbol?: string, decimals = 18) => {
    const targetSymbol = symbol?.trim() || resolvedAssetSymbol;
    const raw = getBalanceWeiAmount(balances, targetSymbol);
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
