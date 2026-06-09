import {
  SUPPORTED_SWAP_MAINNET_CHAIN_IDS,
  toPaycrestNetworkKey,
} from "@/lib/chains/supportedSwapChains";
import { resolveNetwork } from "@/lib/wallet/networks";
import type { ChainBalanceEntry, WalletBalances } from "@/lib/wallet/types";
import { estimateStablecoinUsdTotal } from "@/lib/wallet/balances";

export const WALLET_BALANCE_CHAIN_KEYS = SUPPORTED_SWAP_MAINNET_CHAIN_IDS.map(
  (chainId) => toPaycrestNetworkKey(undefined, chainId) ?? "base",
).filter((key, index, keys) => keys.indexOf(key) === index);

export type AggregatedWalletBalances = {
  entries: ChainBalanceEntry[];
  balances: Record<string, number>;
  totalUsd: number;
  chains: WalletBalances[];
};

export function mergeWalletBalances(
  chainBalances: WalletBalances[],
): AggregatedWalletBalances {
  const balances: Record<string, number> = {};
  const entries: ChainBalanceEntry[] = [];

  for (const chainBalance of chainBalances) {
    for (const entry of chainBalance.entries) {
      if (entry.balance <= 0) {
        continue;
      }

      entries.push(entry);
      balances[entry.symbol] = (balances[entry.symbol] ?? 0) + entry.balance;
    }
  }

  entries.sort((left, right) => right.balance - left.balance);

  const totalUsd = chainBalances.reduce(
    (sum, chainBalance) =>
      sum + estimateStablecoinUsdTotal(chainBalance.balances),
    0,
  );

  return {
    entries,
    balances,
    totalUsd,
    chains: chainBalances,
  };
}

export function getWalletBalanceChainIds(): number[] {
  return WALLET_BALANCE_CHAIN_KEYS.map(
    (chainKey) => resolveNetwork(chainKey).chain.id,
  );
}
