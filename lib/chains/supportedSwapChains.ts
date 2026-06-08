/**
 * Paycrest off-ramp mainnets supported by Noblocks web.
 * Chain IDs are the stable join key with LiFi; keys differ (e.g. LiFi `bas` → Paycrest `base`).
 */
export const SUPPORTED_SWAP_MAINNET_CHAIN_IDS = [
  8453, // Base
  56, // BSC
  42161, // Arbitrum
  137, // Polygon
  1135, // Lisk
  1, // Ethereum
  42220, // Celo
  534352, // Scroll
] as const;

export const SUPPORTED_SWAP_TESTNET_CHAIN_IDS = [
  84532, // Base Sepolia
] as const;

const LIFI_KEY_TO_PAYCREST_NETWORK: Record<string, string> = {
  bas: "base",
  base: "base",
  bsc: "bnb-smart-chain",
  "bnb-smart-chain": "bnb-smart-chain",
  arb: "arbitrum-one",
  arbitrum: "arbitrum-one",
  "arbitrum-one": "arbitrum-one",
  pol: "polygon",
  polygon: "polygon",
  lsk: "lisk",
  lisk: "lisk",
  eth: "ethereum",
  ethereum: "ethereum",
  cel: "celo",
  celo: "celo",
  scl: "scroll",
  scroll: "scroll",
  base_sepolia: "base",
};

const CHAIN_ID_TO_PAYCREST_NETWORK: Record<number, string> = {
  8453: "base",
  56: "bnb-smart-chain",
  42161: "arbitrum-one",
  137: "polygon",
  1135: "lisk",
  1: "ethereum",
  42220: "celo",
  534352: "scroll",
  84532: "base",
};

/** Product sort order (matches agentic-web network picker). */
export const SWAP_CHAIN_DISPLAY_ORDER = [
  "Base",
  "BSC",
  "Arbitrum",
  "Polygon",
  "Lisk",
  "Ethereum",
  "Celo",
  "Scroll",
];

export function toPaycrestNetworkKey(
  chainKey?: string,
  chainId?: number,
): string | null {
  if (chainKey) {
    const normalized = chainKey.trim().toLowerCase();
    const mapped = LIFI_KEY_TO_PAYCREST_NETWORK[normalized];
    if (mapped) {
      return mapped;
    }
  }

  if (typeof chainId === "number" && CHAIN_ID_TO_PAYCREST_NETWORK[chainId]) {
    return CHAIN_ID_TO_PAYCREST_NETWORK[chainId];
  }

  return null;
}

export function isSupportedSwapChainId(
  chainId: number,
  includeTestnets = false,
): boolean {
  if (
    SUPPORTED_SWAP_MAINNET_CHAIN_IDS.includes(
      chainId as (typeof SUPPORTED_SWAP_MAINNET_CHAIN_IDS)[number],
    )
  ) {
    return true;
  }

  if (!includeTestnets) {
    return false;
  }

  return SUPPORTED_SWAP_TESTNET_CHAIN_IDS.includes(
    chainId as (typeof SUPPORTED_SWAP_TESTNET_CHAIN_IDS)[number],
  );
}

export function isSupportedSwapChain(
  chain: { id: number; key?: string },
  includeTestnets = false,
): boolean {
  return isSupportedSwapChainId(chain.id, includeTestnets);
}

export function sortSwapChainsByProductOrder<
  T extends { name: string },
>(chains: T[]): T[] {
  return [...chains].sort((left, right) => {
    const leftIndex = SWAP_CHAIN_DISPLAY_ORDER.indexOf(left.name);
    const rightIndex = SWAP_CHAIN_DISPLAY_ORDER.indexOf(right.name);

    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    }

    return left.name.localeCompare(right.name);
  });
}
