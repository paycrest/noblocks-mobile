import { LIFI_API_BASE_URL } from "@/api/queryConstants";
import type { LifiChain, LifiToken, LifiTokensResponse } from "@/api/queryTypes";
import { SUPPORTED_SWAP_MAINNET_CHAIN_IDS } from "@/lib/chains/supportedSwapChains";
import {
  fetchEvmWalletBalances,
  getWalletTokenBalance,
} from "@/lib/wallet/balances";
import { resolveNetwork } from "@/lib/wallet/networks";
import { getNetworkTokens } from "@/lib/wallet/tokens";
import type { WalletBalances, WalletToken } from "@/lib/wallet/types";

const BSC_CHAIN_ID = 56;
const LOGO_CATALOG_CACHE_MS = 5 * 60 * 1000;
const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/** Last-resort logos when LiFi has no entry for a chain (e.g. cNGN on Base). */
const KNOWN_TOKEN_LOGOS: Record<string, string> = {
  cngn: "https://static.debank.com/image/matic_token/logo_url/0x52828daa48c1a9a06f37500882b42daf0be04c3b/801fefefec4326f6c18a8eeb294d4adb.png",
};

type LifiLookup = {
  byAddress: Map<string, LifiToken>;
  bySymbol: Map<string, LifiToken>;
  byCoinKey: Map<string, LifiToken>;
};

let globalLogoCatalog: LifiToken[] | null = null;
let globalLogoCatalogFetchedAt = 0;

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function normalizeSymbolKey(symbol: string) {
  return symbol.trim().toLowerCase();
}

function normalizeCoinKey(coinKey: string) {
  return coinKey.trim();
}

async function fetchLifiTokenCatalog(chainId: number): Promise<LifiToken[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${LIFI_API_BASE_URL}/tokens?chains=${chainId}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as LifiTokensResponse;
    return data.tokens?.[String(chainId)] ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchGlobalLifiLogoCatalog(): Promise<LifiToken[]> {
  const now = Date.now();
  if (
    globalLogoCatalog &&
    now - globalLogoCatalogFetchedAt < LOGO_CATALOG_CACHE_MS
  ) {
    return globalLogoCatalog;
  }

  const catalogs = await Promise.all(
    SUPPORTED_SWAP_MAINNET_CHAIN_IDS.map((chainId) =>
      fetchLifiTokenCatalog(chainId),
    ),
  );

  globalLogoCatalog = catalogs.flat();
  globalLogoCatalogFetchedAt = now;
  return globalLogoCatalog;
}

function indexLifiToken(
  token: LifiToken,
  lookup: LifiLookup,
  preferExisting = false,
) {
  const normalizedAddress = normalizeAddress(token.address ?? "");
  if (normalizedAddress) {
    if (!preferExisting || !lookup.byAddress.has(normalizedAddress)) {
      lookup.byAddress.set(normalizedAddress, token);
    }
  }

  const symbolKey = normalizeSymbolKey(token.symbol);
  if (symbolKey) {
    if (!preferExisting || !lookup.bySymbol.has(symbolKey)) {
      lookup.bySymbol.set(symbolKey, token);
    }
  }

  if (token.coinKey) {
    const exactCoinKey = normalizeCoinKey(token.coinKey);
    const lowerCoinKey = exactCoinKey.toLowerCase();

    if (!preferExisting || !lookup.byCoinKey.has(exactCoinKey)) {
      lookup.byCoinKey.set(exactCoinKey, token);
    }
    if (
      lowerCoinKey !== exactCoinKey &&
      (!preferExisting || !lookup.byCoinKey.has(lowerCoinKey))
    ) {
      lookup.byCoinKey.set(lowerCoinKey, token);
    }
  }
}

function buildLifiLookup(tokens: LifiToken[], preferExisting = false): LifiLookup {
  const lookup: LifiLookup = {
    byAddress: new Map(),
    bySymbol: new Map(),
    byCoinKey: new Map(),
  };

  for (const token of tokens) {
    indexLifiToken(token, lookup, preferExisting);
  }

  return lookup;
}

function findLifiMatch(
  token: WalletToken,
  lookup: LifiLookup,
): LifiToken | undefined {
  const normalizedAddress = normalizeAddress(token.address ?? "");
  const symbolKey = normalizeSymbolKey(token.symbol);
  const exactCoinKey = token.symbol.trim();

  if (normalizedAddress) {
    const byAddress = lookup.byAddress.get(normalizedAddress);
    if (byAddress) {
      return byAddress;
    }
  }

  const byCoinKey =
    lookup.byCoinKey.get(exactCoinKey) ??
    lookup.byCoinKey.get(exactCoinKey.toLowerCase());
  if (byCoinKey) {
    return byCoinKey;
  }

  const bySymbol = lookup.bySymbol.get(symbolKey);
  if (bySymbol) {
    return bySymbol;
  }

  if (token.isNative) {
    return (
      lookup.byAddress.get(NATIVE_TOKEN_ADDRESS) ??
      lookup.bySymbol.get(symbolKey)
    );
  }

  return undefined;
}

function toLifiToken(
  token: WalletToken,
  chainId: number,
  chainLookup: LifiLookup,
  globalLookup: LifiLookup,
): LifiToken {
  const lifiMatch =
    findLifiMatch(token, chainLookup) ?? findLifiMatch(token, globalLookup);
  const symbolKey = normalizeSymbolKey(token.symbol);

  return {
    chainId,
    address: token.address,
    symbol: token.symbol,
    name: lifiMatch?.name ?? token.name ?? token.symbol,
    decimals: token.decimals,
    logoURI: lifiMatch?.logoURI ?? KNOWN_TOKEN_LOGOS[symbolKey],
    coinKey: lifiMatch?.coinKey,
    priceUSD: lifiMatch?.priceUSD,
  };
}

/**
 * Returns Paycrest-supported tokens for a network, enriched with LiFi logos when available.
 * This is the source of truth for the swap token picker (not the full LiFi catalog).
 */
export async function fetchSupportedSwapTokens(
  chainId: number,
  chainKey?: string,
): Promise<LifiToken[]> {
  const { chain } = resolveNetwork(chainKey);
  const [supportedTokens, lifiCatalog, globalLogoCatalog] = await Promise.all([
    getNetworkTokens(chain.name),
    fetchLifiTokenCatalog(chainId),
    fetchGlobalLifiLogoCatalog(),
  ]);

  if (!supportedTokens.length) {
    return [];
  }

  const chainLookup = buildLifiLookup(lifiCatalog);
  const globalLookup = buildLifiLookup(globalLogoCatalog, true);

  return supportedTokens.map((token) =>
    toLifiToken(token, chainId, chainLookup, globalLookup),
  );
}

function getFallbackTokenSymbol(chainId: number): string {
  return chainId === BSC_CHAIN_ID ? "USDT" : "USDC";
}

function pickTokenWithHighestBalance(
  tokens: LifiToken[],
  walletBalances: WalletBalances | null,
): LifiToken | null {
  let bestToken: LifiToken | null = null;
  let bestBalance = 0;

  for (const token of tokens) {
    const balance = getWalletTokenBalance(token, walletBalances);
    if (balance > bestBalance) {
      bestBalance = balance;
      bestToken = token;
    }
  }

  return bestBalance > 0 ? bestToken : null;
}

function pickFallbackToken(
  tokens: LifiToken[],
  chainId: number,
): LifiToken | null {
  const fallbackSymbol = getFallbackTokenSymbol(chainId);
  return (
    tokens.find(
      (token) =>
        normalizeSymbolKey(token.symbol) === fallbackSymbol.toLowerCase(),
    ) ?? null
  );
}

/**
 * Picks the default send token after a network change:
 * highest balance first, then network fallback (BSC → USDT, others → USDC).
 */
export async function resolveDefaultSwapToken(
  chain: Pick<LifiChain, "id" | "key">,
  walletAddress?: string | null,
): Promise<LifiToken | null> {
  const tokens = await fetchSupportedSwapTokens(chain.id, chain.key);
  if (!tokens.length) {
    return null;
  }

  let walletBalances: WalletBalances | null = null;
  if (walletAddress) {
    const { chain: viemChain } = resolveNetwork(chain.key);
    walletBalances = await fetchEvmWalletBalances(viemChain, walletAddress);
  }

  return (
    pickTokenWithHighestBalance(tokens, walletBalances) ??
    pickFallbackToken(tokens, chain.id)
  );
}
