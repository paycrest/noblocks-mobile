import { useEmbeddedEthereumWallet } from "@privy-io/expo";

export function useWalletAddress(): string | undefined {
  const { wallets } = useEmbeddedEthereumWallet();
  return wallets?.[0]?.address;
}
