import { FALLBACK_TOKENS } from "@/lib/wallet/fallbackTokens";
import { normalizeNetworkName } from "@/lib/wallet/networks";
import type { PaycrestApiToken, WalletToken } from "@/lib/wallet/types";

const TOKEN_CACHE_DURATION_MS = 5 * 60 * 1000;

let tokensCache: Record<string, WalletToken[]> = {};
let lastTokenFetch = 0;
let ongoingFetch: Promise<void> | null = null;

function transformToken(apiToken: PaycrestApiToken): WalletToken {
  return {
    name: apiToken.symbol,
    symbol: apiToken.symbol,
    decimals: apiToken.decimals,
    address: apiToken.contractAddress,
  };
}

export async function fetchPaycrestTokens(): Promise<PaycrestApiToken[]> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return [];
  }

  const response = await fetch(`${baseUrl}/tokens`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens (${response.status})`);
  }

  const payload = (await response.json()) as {
    data?: PaycrestApiToken[];
  };

  return Array.isArray(payload.data) ? payload.data : [];
}

export async function getNetworkTokens(network = ""): Promise<WalletToken[]> {
  const now = Date.now();

  if (tokensCache[network] && now - lastTokenFetch < TOKEN_CACHE_DURATION_MS) {
    return tokensCache[network] ?? [];
  }

  try {
    if (
      Object.keys(tokensCache).length === 0 ||
      now - lastTokenFetch >= TOKEN_CACHE_DURATION_MS
    ) {
      if (ongoingFetch) {
        await ongoingFetch;
        return tokensCache[network] ?? [];
      }

      ongoingFetch = (async () => {
        const apiTokens = await fetchPaycrestTokens();
        const grouped: Record<string, WalletToken[]> = {};

        apiTokens.forEach((apiToken) => {
          const networkName = normalizeNetworkName(apiToken.network);
          if (!grouped[networkName]) {
            grouped[networkName] = [];
          }
          grouped[networkName].push(transformToken(apiToken));
        });

        Object.keys(FALLBACK_TOKENS).forEach((networkName) => {
          if (!grouped[networkName] || grouped[networkName].length === 0) {
            grouped[networkName] = FALLBACK_TOKENS[networkName];
          }
        });

        tokensCache = grouped;
        lastTokenFetch = now;
      })();

      await ongoingFetch;
      ongoingFetch = null;
    }

    return tokensCache[network] ?? FALLBACK_TOKENS[network] ?? [];
  } catch (error) {
    console.error("Failed to fetch tokens from API, using fallback:", error);
    ongoingFetch = null;
    return FALLBACK_TOKENS[network] ?? [];
  }
}
