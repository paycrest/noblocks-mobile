export function getRpcUrl(networkName: string): string {
  const rpcUrlKey = process.env.EXPO_PUBLIC_RPC_URL_KEY;

  switch (networkName) {
    case "Polygon":
      return rpcUrlKey
        ? `https://api-polygon-mainnet-full.n.dwellir.com/${rpcUrlKey}`
        : "https://polygon-rpc.com";
    case "BNB Smart Chain":
      return rpcUrlKey
        ? `https://api-bsc-mainnet-full.n.dwellir.com/${rpcUrlKey}`
        : "https://bsc-dataseed.bnbchain.org";
    case "Base":
      return rpcUrlKey
        ? `https://api-base-mainnet-archive.n.dwellir.com/${rpcUrlKey}`
        : "https://mainnet.base.org";
    case "Base Sepolia":
      return "https://sepolia.base.org";
    case "Arbitrum One":
      return rpcUrlKey
        ? `https://api-arbitrum-mainnet-archive.n.dwellir.com/${rpcUrlKey}`
        : "https://arb1.arbitrum.io/rpc";
    case "Optimism":
      return rpcUrlKey
        ? `https://api-optimism-mainnet-archive.n.dwellir.com/${rpcUrlKey}`
        : "https://mainnet.optimism.io";
    case "Ethereum":
      return rpcUrlKey
        ? `https://api-ethereum-mainnet.n.dwellir.com/${rpcUrlKey}`
        : "https://ethereum.publicnode.com";
    case "BNB Smart Chain":
      return rpcUrlKey
        ? `https://api-bsc-mainnet-full.n.dwellir.com/${rpcUrlKey}`
        : "https://bsc-dataseed.bnbchain.org";
    case "Celo":
      return "https://forno.celo.org";
    case "Scroll":
      return rpcUrlKey
        ? `https://api-scroll-mainnet-archive.n.dwellir.com/${rpcUrlKey}`
        : "https://rpc.scroll.io";
    case "Lisk":
      return "https://rpc.api.lisk.com";
    default:
      return "https://mainnet.base.org";
  }
}
