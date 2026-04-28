export interface PaycrestCurrency {
  code: string;
  name: string;
  shortName: string;
  decimals: number;
  symbol: string;
  marketBuyRate: string;
  marketSellRate: string;
  logoURI?: string;
}

export interface CurrenciesApiResponse {
  status: string;
  message: string;
  data: Omit<PaycrestCurrency, "logoURI">[];
}

export interface PrivyBalance {
  chain: string;
  asset: string;
  raw_value: string;
  raw_value_decimals: number;
  display_values?: {
    eth?: string;
    usd?: string;
    [symbol: string]: string | undefined;
  };
}

export interface GetBalanceResponse {
  balances: PrivyBalance[];
}

export interface WalletBalanceOptions {
  chain: string;
  asset: string;
}

export interface PaycrestInstitution {
  name: string;
  code: string;
  type: string;
  logoURI?: string;
}

export interface InstitutionsApiResponse {
  status: string;
  message: string;
  data: Omit<PaycrestInstitution, "logoURI">[];
}

export interface NigerianBank {
  name: string;
  slug: string;
  code: string;
  ussd: string;
  logo: string;
}

export interface LifiChain {
  id: number;
  key: string;
  name: string;
  coin: string;
  logoURI?: string;
  mainnet: boolean;
  chainType: string;
}

export interface LifiChainsResponse {
  chains: LifiChain[];
}

export interface LifiToken {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: string;
  coinKey?: string;
}

export interface LifiTokensResponse {
  tokens: Record<string, LifiToken[]>;
}

export interface PaycrestRateResponse {
  status: string;
  message: string;
  data?: {
    buy?: {
      rate?: string;
    };
  };
}

export interface CreateSenderOrderParams {
  amount: string;
  token: string;
  network: string;
  fiatCurrency: string;
  institution: string;
  accountIdentifier: string;
  refundAddress?: string;
  accountName?: string;
  memo?: string;
  rate?: string;
}

export interface CreateSenderOrderResponse {
  status: string;
  message: string;
  data?: {
    id?: string;
    [key: string]: unknown;
  };
}

export interface VerifyAccountResponse {
  status: string;
  message: string;
  data:
    | string
    | {
        accountName?: string;
        account_name?: string;
        name?: string;
      };
}

export type SwapStatus = "pending" | "succeeded" | "rejected" | "failed";

export interface SwapAction {
  id: string;
  status: SwapStatus;
  wallet_id: string;
  caip2: string;
  input_token: string;
  output_token: string;
  input_amount: string;
}

export interface StartSwapParams {
  walletId?: string;
  caip2: string;
  inputToken: string;
  outputToken: string;
  amount: string;
  amountType?: "exact_input" | "exact_output";
  slippageBps?: number;
  recipient?: string;
}

export interface StartSwapAuth {
  appId?: string;
  appSecret: string;
  authorizationSignature?: string;
  idempotencyKey?: string;
}

export interface PrivySwapBody {
  caip2: string;
  input_token: string;
  output_token: string;
  amount: string;
  amount_type: "exact_input" | "exact_output";
  slippage_bps?: number;
  recipient?: string;
}
