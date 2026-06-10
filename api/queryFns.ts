import { get, post } from "@/api/apiClient";
import {
  CURRENCY_FLAG_MAP,
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
  PaycrestOrderDetailsResponse,
  PaycrestRateResponse,
  PrivyBalance,
  PrivySwapBody,
  StartSwapAuth,
  StartSwapParams,
  SwapAction,
  SwapStatus,
  VerifyAccountResponse,
  WalletBalanceOptions,
} from "@/api/queryTypes";
import {
  isSupportedSwapChainId,
  sortSwapChainsByProductOrder,
  toPaycrestNetworkKey,
} from "@/lib/chains/supportedSwapChains";
import { getPaycrestClient } from "@/lib/paycrest/client";
import { isPrivySupportedAsset } from "@/utils/privy";
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
  PaycrestOrderDetailsResponse,
  PaycrestRateResponse,
  PrivyBalance,
  StartSwapAuth,
  StartSwapParams,
  SwapAction,
  SwapStatus,
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

  const chains = (data.chains ?? []).filter(
    (chain) =>
      chain.chainType === "EVM" &&
      (includeTestnets
        ? !chain.mainnet
        : chain.mainnet) &&
      isSupportedSwapChainId(chain.id, includeTestnets),
  );

  return sortSwapChainsByProductOrder(chains);
}

/**
 * Fetches assets for a specific chain from LiFi.
 * Prefer {@link fetchSupportedSwapTokens} for the swap token picker.
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
 * @param amount Token amount used for the quote (defaults to 1).
 * @param side Quote side — off-ramp uses sell, on-ramp uses buy.
 */
export async function fetchPaycrestRate(
  network: string,
  token: string,
  fiat: string,
  amount = 1,
  side: "buy" | "sell" = "sell",
): Promise<PaycrestRateResponse> {
  const normalizedNetwork =
    toPaycrestNetworkKey(network) ?? network.trim().toLowerCase();

  const quote = await getPaycrestClient().sender().getTokenRate({
    network: normalizedNetwork,
    token,
    fiat,
    amount: String(amount),
    side,
  });

  return {
    status: "success",
    message: "Rate fetched",
    data: quote,
  };
}

/**
 * Fetches the current status of a Paycrest sender order.
 * @param orderId Order id returned from createPaycrestSenderOrder.
 */
export async function fetchPaycrestOrderStatus(
  orderId: string,
): Promise<PaycrestOrderDetailsResponse> {
  const order = await getPaycrestClient().sender().getOrder(orderId);

  return {
    status: "success",
    message: "Order fetched",
    data: order,
  };
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
  const accountName = await getPaycrestClient()
    .sender()
    .verifyAccount(params);

  return {
    status: "success",
    message: "Account verified",
    data: accountName,
  };
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
  const normalizedNetwork =
    toPaycrestNetworkKey(params.network) ??
    params.network.trim().toLowerCase();

  const order = await getPaycrestClient().sender().createOfframpOrder({
    amount: params.amount,
    ...(params.rate ? { rate: params.rate } : {}),
    source: {
      type: "crypto",
      currency: params.token,
      network: normalizedNetwork,
      refundAddress: params.refundAddress ?? "",
    },
    destination: {
      type: "fiat",
      currency: params.fiatCurrency,
      recipient: {
        institution: params.institution,
        accountIdentifier: params.accountIdentifier,
        accountName: params.accountName ?? "",
        memo: params.memo ?? "",
      },
    },
  });

  return {
    status: "success",
    message: "Order created",
    data: order,
  };
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
