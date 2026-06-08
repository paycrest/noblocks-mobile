import { getNetworkTokens } from "@/lib/wallet/tokens";
import type { WalletBalances, WalletToken } from "@/lib/wallet/types";
import { getRpcUrl } from "@/lib/wallet/rpc";
import {
  createPublicClient,
  erc20Abi,
  http,
  type Address,
  type Chain,
  type PublicClient,
} from "viem";

function fillBalancesFromWei(
  token: WalletToken,
  balanceInWei: bigint,
  balances: Record<string, number>,
  balancesInWei: Record<string, bigint>,
) {
  balancesInWei[token.symbol] = balanceInWei;
  const balance = Number(balanceInWei) / 10 ** token.decimals;
  balances[token.symbol] = Number.isFinite(balance) ? balance : 0;
}

export async function fetchEvmWalletBalances(
  chain: Chain,
  address: string,
): Promise<WalletBalances> {
  const client = createPublicClient({
    chain,
    transport: http(getRpcUrl(chain.name)),
  }) as PublicClient;

  const supportedTokens = await getNetworkTokens(chain.name);
  const chainName = chain.name;
  const chainId = chain.id;

  const empty = (): WalletBalances => ({
    chainName,
    chainId,
    entries: [],
    total: 0,
    balances: {},
    balancesInWei: {},
  });

  if (!supportedTokens.length || !address) {
    return empty();
  }

  const balances: Record<string, number> = {};
  const balancesInWei: Record<string, bigint> = {};
  const walletAddress = address as Address;

  const nativeTokens = supportedTokens.filter(
    (token) => token.isNative && token.address === "",
  );
  const erc20Tokens = supportedTokens.filter(
    (token) => !(token.isNative && token.address === ""),
  );

  await Promise.all([
    Promise.all(
      nativeTokens.map(async (token) => {
        try {
          const balanceInWei = await client.getBalance({ address: walletAddress });
          fillBalancesFromWei(token, balanceInWei, balances, balancesInWei);
        } catch (error) {
          console.error(`Error fetching native balance for ${token.symbol}:`, error);
          balances[token.symbol] = 0;
          balancesInWei[token.symbol] = BigInt(0);
        }
      }),
    ),
    (async () => {
      if (erc20Tokens.length === 0) {
        return;
      }

      try {
        const contracts = erc20Tokens.map((token) => ({
          address: token.address as Address,
          abi: erc20Abi,
          functionName: "balanceOf" as const,
          args: [walletAddress] as const,
        }));

        const multicallResults = await client.multicall({
          contracts,
          allowFailure: true,
        });

        multicallResults.forEach((result, index) => {
          const token = erc20Tokens[index];
          if (result.status === "success") {
            fillBalancesFromWei(token, result.result, balances, balancesInWei);
          } else {
            balances[token.symbol] = 0;
            balancesInWei[token.symbol] = BigInt(0);
          }
        });
      } catch (error) {
        console.error("ERC-20 multicall failed, falling back to sequential", error);
        for (const token of erc20Tokens) {
          try {
            const balanceInWei = await client.readContract({
              address: token.address as Address,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [walletAddress],
            });
            fillBalancesFromWei(token, balanceInWei, balances, balancesInWei);
          } catch (readError) {
            console.error(`Error fetching balance for ${token.symbol}:`, readError);
            balances[token.symbol] = 0;
            balancesInWei[token.symbol] = BigInt(0);
          }
        }
      }
    })(),
  ]);

  for (const token of supportedTokens) {
    if (balances[token.symbol] === undefined) {
      balances[token.symbol] = 0;
      balancesInWei[token.symbol] = BigInt(0);
    }
  }

  const entries = supportedTokens.map((token) => ({
    chainName,
    chainId,
    symbol: token.symbol,
    address: token.address,
    decimals: token.decimals,
    balance: balances[token.symbol] ?? 0,
    balanceWei: balancesInWei[token.symbol],
  }));

  const total = Object.values(balances).reduce(
    (sum, value) => sum + (Number.isFinite(value) ? value : 0),
    0,
  );

  return {
    chainName,
    chainId,
    entries,
    total,
    balances,
    balancesInWei,
  };
}

const STABLECOIN_SYMBOLS = new Set(["USDC", "USDT", "DAI", "cUSD", "cNGN"]);

export function estimateStablecoinUsdTotal(
  balances: Record<string, number> | undefined,
): number {
  if (!balances) {
    return 0;
  }

  return Object.entries(balances).reduce((sum, [symbol, amount]) => {
    if (!STABLECOIN_SYMBOLS.has(symbol)) {
      return sum;
    }
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}

export function formatTokenAmount(amount: number, maximumFractionDigits = 6) {
  return amount.toLocaleString(undefined, { maximumFractionDigits });
}

export function getRawBalanceString(
  balancesInWei: Record<string, bigint> | undefined,
  symbol: string,
  decimals: number,
): string {
  const raw = balancesInWei?.[symbol];
  if (raw === undefined) {
    return "";
  }
  return raw.toString().padStart(decimals + 1, "0");
}

export function weiToDecimalString(rawValue: bigint | string, decimals: number) {
  const raw =
    typeof rawValue === "bigint" ? rawValue.toString() : rawValue.trim();

  if (!raw || !/^\d+$/.test(raw)) {
    return "0";
  }

  const normalizedDecimals = Math.max(0, decimals);
  if (normalizedDecimals === 0) {
    return raw;
  }

  const padded = raw.padStart(normalizedDecimals + 1, "0");
  const whole = padded.slice(0, -normalizedDecimals) || "0";
  const fraction = padded.slice(-normalizedDecimals).replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole;
}
