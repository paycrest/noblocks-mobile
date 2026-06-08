import type { Chain } from "viem";
import {
  arbitrum,
  base,
  baseSepolia,
  bsc,
  celo,
  lisk,
  mainnet,
  optimism,
  polygon,
  scroll,
} from "viem/chains";

export type SupportedNetwork = {
  displayName: string;
  chain: Chain;
};

const NETWORKS: Record<string, SupportedNetwork> = {
  base: { displayName: "Base", chain: base },
  bas: { displayName: "Base", chain: base },
  base_sepolia: { displayName: "Base Sepolia", chain: baseSepolia },
  eth: { displayName: "Ethereum", chain: mainnet },
  ethereum: { displayName: "Ethereum", chain: mainnet },
  arb: { displayName: "Arbitrum One", chain: arbitrum },
  arbitrum: { displayName: "Arbitrum One", chain: arbitrum },
  "arbitrum-one": { displayName: "Arbitrum One", chain: arbitrum },
  opt: { displayName: "Optimism", chain: optimism },
  optimism: { displayName: "Optimism", chain: optimism },
  pol: { displayName: "Polygon", chain: polygon },
  polygon: { displayName: "Polygon", chain: polygon },
  bsc: { displayName: "BNB Smart Chain", chain: bsc },
  "bnb-smart-chain": { displayName: "BNB Smart Chain", chain: bsc },
  cel: { displayName: "Celo", chain: celo },
  celo: { displayName: "Celo", chain: celo },
  scl: { displayName: "Scroll", chain: scroll },
  scroll: { displayName: "Scroll", chain: scroll },
  lsk: { displayName: "Lisk", chain: lisk },
  lisk: { displayName: "Lisk", chain: lisk },
};

export function normalizeNetworkName(networkId: string): string {
  if (!networkId) {
    return networkId;
  }

  const acronyms = new Set(["BNB", "USD", "API", "RPC", "NFT", "DeFi"]);

  return networkId
    .split("-")
    .map((word) => {
      const upperWord = word.toUpperCase();
      if (acronyms.has(upperWord)) {
        return upperWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function resolveNetwork(chainKey?: string): SupportedNetwork {
  const normalized = chainKey?.trim().toLowerCase() ?? "base";
  return NETWORKS[normalized] ?? NETWORKS.base;
}
