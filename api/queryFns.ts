import { get, post } from "@/api/apiClient";
import axios from "axios";
import { isPrivySupportedAsset, isPrivySupportedChain } from "@/utils/privy";
import {
  CURRENCY_FLAG_MAP,
  FEATURED_CHAIN_ORDER,
  FEATURED_SYMBOL_ORDER,
  LIFI_API_BASE_URL,
  PRIVY_APP_ID,
  PRIVY_APP_SECRET,
  PRIVY_BASE_URL,
} from "@/api/queryConstants";
import type {
  CurrenciesApiResponse,
  GetBalanceResponse,
  InstitutionsApiResponse,
  LifiChain,
  LifiChainsResponse,
  LifiToken,
  LifiTokensResponse,
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

function privyAuthHeader() {
  const encoded = btoa(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`);
  return {
    Authorization: `Basic ${encoded}`,
    "privy-app-id": PRIVY_APP_ID,
  };
}

export type {
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

export const getFlagURI = (currencyCode: string) => {
  const countryCode = CURRENCY_FLAG_MAP[currencyCode.toUpperCase()];
  if (!countryCode) return undefined;
  return `https://flagcdn.com/w80/${countryCode}.png`;
};

export async function fetchPaycrestCurrencies(): Promise<PaycrestCurrency[]> {
  const response = await get<CurrenciesApiResponse>("/currencies");
  return (response.data ?? []).map((currency) => ({
    ...currency,
    logoURI: getFlagURI(currency.code),
  }));
}

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

export async function fetchPaycrestInstitutions(
  currencyCode: string,
): Promise<PaycrestInstitution[]> {
  const response = await get<InstitutionsApiResponse>(
    `/institutions/${currencyCode.toUpperCase()}`,
  );

  return response.data ?? [];
}

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

export async function fetchLifiTokens(chainId: number): Promise<LifiToken[]> {
  const response = await fetch(`${LIFI_API_BASE_URL}/tokens?chains=${chainId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch assets (${response.status})`);
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

export async function fetchPaycrestRate(
  network: string,
  token: string,
  fiat: string,
): Promise<PaycrestRateResponse> {
  return get<PaycrestRateResponse>(`/rates/${network}/${token}/1/${fiat}`);
}

export async function verifyPaycrestAccount(params: {
  institution: string;
  accountIdentifier: string;
}): Promise<VerifyAccountResponse> {
  return post<VerifyAccountResponse>("/verify-account", params);
}

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
