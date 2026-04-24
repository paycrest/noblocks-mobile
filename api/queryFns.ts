import { get, post } from "@/api/apiClient";
import {
  CURRENCY_FLAG_MAP,
  FEATURED_CHAIN_ORDER,
  FEATURED_SYMBOL_ORDER,
  LIFI_API_BASE_URL,
  NIGERIAN_BANKS_API_URL,
  PRIVY_APP_ID,
  PRIVY_APP_SECRET,
  PRIVY_BASE_URL,
} from "@/api/queryConstants";
import type {
  CreateSenderOrderParams,
  CreateSenderOrderResponse,
  CurrenciesApiResponse,
  GetBalanceResponse,
  InstitutionsApiResponse,
  LifiChain,
  LifiChainsResponse,
  LifiToken,
  LifiTokensResponse,
  NigerianBank,
  PaycrestCurrency,
  PaycrestInstitution,
  PaycrestRateResponse,
  PrivySwapBody,
  StartSwapAuth,
  StartSwapParams,
  SwapAction,
  VerifyAccountResponse,
  WalletBalanceOptions,
} from "@/api/queryTypes";
import { isPrivySupportedAsset, isPrivySupportedChain } from "@/utils/privy";
import axios from "axios";

let nigerianBankLogoMapPromise: Promise<Record<string, string>> | null = null;

/**
 * Builds the Basic auth headers required by Privy REST endpoints.
 */
function privyAuthHeader() {
  const encoded = btoa(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`);
  return {
    Authorization: `Basic ${encoded}`,
    "privy-app-id": PRIVY_APP_ID,
  };
}

export type {
  CreateSenderOrderParams,
  CreateSenderOrderResponse,
  GetBalanceResponse,
  LifiChain,
  LifiToken,
  PaycrestCurrency,
  PaycrestInstitution,
  PaycrestRateResponse,
  StartSwapAuth,
  StartSwapParams,
  SwapAction,
  VerifyAccountResponse,
  WalletBalanceOptions,
};

/**
 * Returns a flag image URL for a fiat currency code.
 * @param currencyCode The fiat currency code, for example NGN or KES.
 */
export const getFlagURI = (currencyCode: string) => {
  const countryCode = CURRENCY_FLAG_MAP[currencyCode.toUpperCase()];
  if (!countryCode) return undefined;
  return `https://flagcdn.com/w80/${countryCode}.png`;
};

/**
 * Normalizes names into a simple lowercase key used for fuzzy lookups.
 * @param value Raw institution name to normalize.
 */
function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Fetches and memoizes Nigerian bank logos, keyed by code and normalized name.
 */
async function fetchNigerianBankLogoMap() {
  if (!nigerianBankLogoMapPromise) {
    nigerianBankLogoMapPromise = fetch(NIGERIAN_BANKS_API_URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch Nigerian bank logos (${response.status})`,
          );
        }

        const banks = (await response.json()) as NigerianBank[];
        const map: Record<string, string> = {};

        banks.forEach((bank) => {
          if (!bank.logo || bank.logo.includes("default-image.png")) {
            return;
          }

          map[bank.code.trim()] = bank.logo;
          map[`name:${normalizeName(bank.name)}`] = bank.logo;
        });

        return map;
      })
      .catch(() => {
        return {};
      });
  }

  return nigerianBankLogoMapPromise;
}

/**
 * Fetches supported Paycrest fiat currencies and enriches each with a flag URL.
 */
export async function fetchPaycrestCurrencies(): Promise<PaycrestCurrency[]> {
  const response = await get<CurrenciesApiResponse>("/currencies");

  const rawCurrencies = Array.isArray(response)
    ? response
    : Array.isArray(response.data)
      ? response.data
      : [];

  return rawCurrencies.map((currency) => ({
    ...currency,
    shortName: currency.shortName ?? currency.code,
    logoURI: getFlagURI(currency.code),
  }));
}

/**
 * Fetches wallet balances from Privy for a specific wallet and asset scope.
 * @param walletId Privy wallet identifier to query.
 * @param balanceOptions Query options where chain is the network key and asset is the token symbol.
 */
export async function fetchPrivyWalletBalance(
  walletId: string,
  balanceOptions: WalletBalanceOptions,
): Promise<GetBalanceResponse> {
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
}

/**
 * Fetches recipient institutions for a fiat currency.
 * @param currencyCode Fiat code used by Paycrest, for example NGN.
 */
export async function fetchPaycrestInstitutions(
  currencyCode: string,
): Promise<PaycrestInstitution[]> {
  const response = await get<InstitutionsApiResponse>(
    `/institutions/${currencyCode.toUpperCase()}`,
  );

  const institutions = response.data ?? [];

  if (currencyCode.toUpperCase() !== "NGN") {
    return institutions;
  }

  const logoMap = await fetchNigerianBankLogoMap();

  return institutions.map((institution) => {
    const logoURI =
      logoMap[institution.code.trim()] ??
      logoMap[`name:${normalizeName(institution.name)}`];

    return {
      ...institution,
      ...(logoURI ? { logoURI } : {}),
    };
  });
}

/**
 * Fetches supported EVM chains from LiFi and returns a sorted, filtered list.
 * @param includeTestnets When true, returns testnets; otherwise returns mainnets.
 */
export async function fetchLifiChains(
  includeTestnets = false,
): Promise<LifiChain[]> {
  const response = await fetch(`${LIFI_API_BASE_URL}/chains`);

  if (!response.ok) {
    throw new Error(`Failed to fetch chains (${response.status})`);
  }

  const data = (await response.json()) as LifiChainsResponse;

  return (data.chains ?? [])
    .filter(
      (chain) =>
        chain.mainnet === !includeTestnets &&
        chain.chainType === "EVM" &&
        isPrivySupportedChain(chain.key),
    )
    .sort((left, right) => {
      const leftFeaturedIndex = FEATURED_CHAIN_ORDER.indexOf(left.name);
      const rightFeaturedIndex = FEATURED_CHAIN_ORDER.indexOf(right.name);

      if (leftFeaturedIndex !== -1 || rightFeaturedIndex !== -1) {
        if (leftFeaturedIndex === -1) return 1;
        if (rightFeaturedIndex === -1) return -1;
        return leftFeaturedIndex - rightFeaturedIndex;
      }

      return left.name.localeCompare(right.name);
    });
}

/**
 * Fetches assets for a specific chain from LiFi.
 * @param chainId Numeric chain id used by LiFi token endpoint.
 */
export async function fetchLifiTokens(chainId: number): Promise<LifiToken[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  let response: Response;

  try {
    response = await fetch(`${LIFI_API_BASE_URL}/tokens?chains=${chainId}`, {
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Fetching assets timed out. Try again.");
    }

    throw new Error("Failed to fetch assets. Try again.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch assets (${response.status}). Try again.`);
  }

  const data = (await response.json()) as LifiTokensResponse;

  return (data.tokens?.[String(chainId)] ?? [])
    .filter(
      (asset) =>
        asset.symbol && asset.name && isPrivySupportedAsset(asset.symbol),
    )
    .sort((left, right) => {
      const leftFeaturedIndex = FEATURED_SYMBOL_ORDER.indexOf(left.symbol);
      const rightFeaturedIndex = FEATURED_SYMBOL_ORDER.indexOf(right.symbol);

      if (leftFeaturedIndex !== -1 || rightFeaturedIndex !== -1) {
        if (leftFeaturedIndex === -1) return 1;
        if (rightFeaturedIndex === -1) return -1;
        return leftFeaturedIndex - rightFeaturedIndex;
      }

      const leftPrice = Number(left.priceUSD ?? 0);
      const rightPrice = Number(right.priceUSD ?? 0);

      if (leftPrice !== rightPrice) {
        return rightPrice - leftPrice;
      }

      return left.symbol.localeCompare(right.symbol);
    })
    .slice(0, 80);
}

/**
 * Fetches conversion rate between a crypto token and fiat currency on Paycrest.
 * @param network Paycrest network key, for example base.
 * @param token Token symbol used by Paycrest rate endpoint, usually lowercase.
 * @param fiat Fiat currency code, for example NGN.
 */
export async function fetchPaycrestRate(
  network: string,
  token: string,
  fiat: string,
): Promise<PaycrestRateResponse> {
  return get<PaycrestRateResponse>(`/rates/${network}/${token}/1/${fiat}`);
}

/**
 * Resolves account details for a recipient bank account.
 * @param params.institution Institution code from the selected recipient bank.
 * @param params.accountIdentifier Account number or recipient identifier to verify.
 */
export async function verifyPaycrestAccount(params: {
  institution: string;
  accountIdentifier: string;
}): Promise<VerifyAccountResponse> {
  return post<VerifyAccountResponse>("/verify-account", params);
}

/**
 * Creates a sender order on Paycrest using crypto source and fiat destination details.
 * @param params.amount Amount to send in source currency units.
 * @param params.token Source crypto symbol, for example USDT.
 * @param params.network Source network key, for example base.
 * @param params.fiatCurrency Destination fiat code, for example NGN.
 * @param params.institution Recipient bank institution code.
 * @param params.accountIdentifier Recipient account number or identifier.
 * @param params.refundAddress Optional refund address for source-chain refunds.
 * @param params.accountName Optional verified recipient account name.
 * @param params.memo Optional transfer note.
 * @param params.rate Optional pre-fetched quote rate.
 */
export async function createPaycrestSenderOrder(
  params: CreateSenderOrderParams,
): Promise<CreateSenderOrderResponse> {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  return post<CreateSenderOrderResponse>(
    "/sender/orders",
    {
      amount: params.amount,
      source: {
        type: "crypto",
        currency: params.token,
        network: params.network,
        ...(params.refundAddress
          ? { refundAddress: params.refundAddress }
          : {}),
      },
      destination: {
        type: "fiat",
        currency: params.fiatCurrency,
        recipient: {
          institution: params.institution,
          accountIdentifier: params.accountIdentifier,
          ...(params.accountName ? { accountName: params.accountName } : {}),
          ...(params.memo ? { memo: params.memo } : {}),
        },
      },
      ...(params.rate ? { rate: params.rate } : {}),
    },
    apiKey
      ? {
          headers: {
            "API-Key": apiKey,
          },
        }
      : undefined,
  );
}

/**
 * Starts a Privy swap action for an embedded wallet.
 * @param params.request Swap payload including chain, token pair, and amount.
 * @param params.auth Optional overrides for app credentials and idempotency/signature values.
 * @param params.embeddedWalletId Fallback wallet id when request.walletId is not provided.
 * @param params.appId Optional app id fallback used when auth.appId is not provided.
 * @param params.appSecret Optional app secret fallback used when auth.appSecret is not provided.
 * @param params.generateAuthorizationSignature Callback used to sign the request when no signature is supplied.
 */
export async function startPrivySwap(params: {
  request: StartSwapParams;
  auth?: Partial<StartSwapAuth>;
  embeddedWalletId: string | null;
  appId?: string;
  appSecret?: string;
  generateAuthorizationSignature: (input: {
    version: 1;
    method: "POST";
    url: string;
    body: PrivySwapBody;
    headers: {
      "privy-app-id": string;
      "privy-idempotency-key"?: string;
    };
  }) => Promise<{ signature: string }>;
}): Promise<SwapAction> {
  const {
    request,
    auth,
    embeddedWalletId,
    appId,
    appSecret,
    generateAuthorizationSignature,
  } = params;
  const resolvedAppId = auth?.appId ?? appId;
  const resolvedAppSecret = auth?.appSecret ?? appSecret;
  const walletId = request.walletId ?? embeddedWalletId;

  if (!resolvedAppId || !resolvedAppSecret) {
    throw new Error("Missing Privy app credentials for swap request.");
  }

  if (!walletId) {
    throw new Error("No embedded wallet found for swap request.");
  }

  const url = `${PRIVY_BASE_URL}/wallets/${walletId}/swap`;
  const body: PrivySwapBody = {
    caip2: request.caip2,
    input_token: request.inputToken,
    output_token: request.outputToken,
    amount: request.amount,
    amount_type: request.amountType ?? "exact_input",
    ...(request.slippageBps !== undefined
      ? { slippage_bps: request.slippageBps }
      : {}),
    ...(request.recipient ? { recipient: request.recipient } : {}),
  };

  const idempotencyKey =
    auth?.idempotencyKey ??
    `swap-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const signingHeaders = {
    "privy-app-id": resolvedAppId,
    "privy-idempotency-key": idempotencyKey,
  };

  const signature =
    auth?.authorizationSignature ??
    (
      await generateAuthorizationSignature({
        version: 1,
        method: "POST",
        url,
        body,
        headers: signingHeaders,
      })
    ).signature;

  const response = await axios.post<SwapAction>(url, body, {
    auth: {
      username: resolvedAppId,
      password: resolvedAppSecret,
    },
    headers: {
      ...signingHeaders,
      "privy-authorization-signature": signature,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
