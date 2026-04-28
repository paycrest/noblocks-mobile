const DEFAULT_PRIVY_BALANCE_CHAIN = "base";

export const PRIVY_SUPPORTED_CHAINS = new Set([
  "ethereum",
  "arbitrum",
  "base",
  "tempo",
  "linea",
  "optimism",
  "polygon",
  "solana",
  "zksync_era",
  "sepolia",
  "arbitrum_sepolia",
  "base_sepolia",
  "linea_testnet",
  "optimism_sepolia",
  "polygon_amoy",
  "solana_devnet",
  "solana_testnet",
]);

const PRIVY_SUPPORTED_ASSETS = new Set([
  "usdc",
  "usdc.e",
  "eth",
  "pol",
  "usdt",
  "eurc",
  "usdb",
  "sol",
]);

const ASSET_ALIASES: Record<string, string> = {
  weth: "eth",
  matic: "pol",
};

const CHAIN_ALIASES: Record<string, string> = {
  eth: "ethereum",
  mainnet: "ethereum",
};

export const normalizePrivyChain = (value?: string): string | null => {
  if (!value) {
    return DEFAULT_PRIVY_BALANCE_CHAIN;
  }

  const normalized = value.trim().toLowerCase();
  const mapped = CHAIN_ALIASES[normalized] ?? normalized;

  if (!PRIVY_SUPPORTED_CHAINS.has(mapped)) {
    return null;
  }

  return mapped;
};

export const isPrivySupportedChain = (value?: string) => {
  return normalizePrivyChain(value) !== null;
};

export const isPrivySupportedAsset = (symbol?: string) => {
  return normalizePrivyAsset(symbol) !== null;
};

export const normalizePrivyAsset = (symbol?: string): string | null => {
  if (!symbol) {
    return null;
  }

  const normalized = symbol.trim().toLowerCase();
  const mapped = ASSET_ALIASES[normalized] ?? normalized;

  if (!PRIVY_SUPPORTED_ASSETS.has(mapped)) {
    return null;
  }

  return mapped;
};
