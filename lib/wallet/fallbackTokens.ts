import type { WalletToken } from "@/lib/wallet/types";

export const FALLBACK_TOKENS: Record<string, WalletToken[]> = {
  Base: [
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    },
    {
      name: "Compliant Naira",
      symbol: "cNGN",
      decimals: 6,
      address: "0x46c85152bfe9f96829aa94755d9f915f9b10ef5f",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "",
      isNative: true,
    },
  ],
  "Arbitrum One": [
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
  ],
  Polygon: [
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    },
  ],
  Ethereum: [
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "",
      isNative: true,
    },
  ],
  Optimism: [
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    },
    {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    },
  ],
};
