export const QUERY_STALE_TIME_MS = 5 * 60 * 1000;
export const RATE_QUERY_STALE_TIME_MS = 60 * 1000;

export const LIFI_API_BASE_URL = "https://li.quest/v1";
export const NIGERIAN_BANKS_API_URL = "https://nigerianbanks.xyz";
export const PRIVY_BASE_URL = process.env.EXPO_PUBLIC_PRIVY_BASE_URL;
export const PRIVY_APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID!;
export const PRIVY_APP_SECRET = process.env.EXPO_PUBLIC_PRIVY_APP_SECRET!;
export const PAYCREST_SENDER_API_KEY =
  process.env.EXPO_PUBLIC_SENDER_API_KEY?.trim() ?? "";

export const FEATURED_SYMBOL_ORDER = ["ETH", "USDC", "USDT", "DAI", "WBTC"];
export const FEATURED_CHAIN_ORDER = [
  "Base",
  "BSC",
  "Arbitrum",
  "Polygon",
  "Lisk",
  "Ethereum",
  "Celo",
  "Scroll",
];

export const CURRENCY_FLAG_MAP: Record<string, string> = {
  NGN: "ng",
  KES: "ke",
  UGX: "ug",
  TZS: "tz",
  MWK: "mw",
  BRL: "br",
  GHS: "gh",
  ZAR: "za",
  XOF: "sn",
  USD: "us",
  GBP: "gb",
  EUR: "eu",
  ARS: "ar",
};
