export type WalletToken = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  isNative?: boolean;
};

export type PaycrestApiToken = {
  symbol: string;
  contractAddress: string;
  decimals: number;
  baseCurrency: string;
  network: string;
};

export type ChainBalanceEntry = {
  chainName: string;
  chainId?: number;
  symbol: string;
  name?: string;
  address: string;
  decimals: number;
  balance: number;
  balanceWei?: bigint;
};

export type WalletBalances = {
  chainName: string;
  chainId?: number;
  entries: ChainBalanceEntry[];
  total: number;
  balances: Record<string, number>;
  balancesInWei?: Record<string, bigint>;
};
