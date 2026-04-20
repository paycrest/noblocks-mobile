import {
  startPrivySwap,
  type StartSwapAuth,
  type StartSwapParams,
  type SwapAction,
  type SwapStatus,
} from "@/api/queryFns";
import {
  useAuthorizationSignature,
  useEmbeddedEthereumWallet,
  usePrivy,
} from "@privy-io/expo";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
const appSecret = process.env.EXPO_PUBLIC_PRIVY_APP_SECRET;

const usePayments = () => {
  const { wallets } = useEmbeddedEthereumWallet();
  const { user } = usePrivy();
  const { generateAuthorizationSignature } = useAuthorizationSignature();

  const embeddedWalletId = useMemo(() => {
    const walletAddress = wallets?.[0]?.address;
    if (!walletAddress) {
      return null;
    }

    const linkedWallet = user?.linked_accounts.find((account) => {
      return (
        account.type === "wallet" &&
        account.chain_type === "ethereum" &&
        "id" in account &&
        "connector_type" in account &&
        account.connector_type === "embedded" &&
        account.address.toLowerCase() === walletAddress.toLowerCase()
      );
    });

    if (!linkedWallet || !("id" in linkedWallet)) {
      return null;
    }

    return linkedWallet.id ?? null;
  }, [user?.linked_accounts, wallets]);

  async function startSwap(
    params: StartSwapParams,
    auth?: Partial<StartSwapAuth>,
  ): Promise<SwapAction> {
    return startPrivySwap({
      request: params,
      auth,
      embeddedWalletId,
      appId,
      appSecret,
      generateAuthorizationSignature,
    });
  }

  async function executeSwap(
    params: StartSwapParams,
    auth?: Partial<StartSwapAuth>,
  ): Promise<SwapAction> {
    try {
      const action = await swapMutation.mutateAsync({ params, auth });
      return action;
    } catch (error) {
      throw error;
    }
  }

  const swapMutation = useMutation({
    mutationFn: async ({
      params,
      auth,
    }: {
      params: StartSwapParams;
      auth?: Partial<StartSwapAuth>;
    }) => {
      return startSwap(params, auth);
    },
  });

  const swapError = useMemo(() => {
    const error = swapMutation.error;
    if (!error) {
      return null;
    }

    return axios.isAxiosError(error) && error.response?.data
      ? JSON.stringify(error.response.data)
      : error instanceof Error
        ? error.message
        : "Swap failed. Please try again.";
  }, [swapMutation.error]);

  return {
    startSwap,
    executeSwap,
    isSwapping: swapMutation.isPending,
    swapError,
    embeddedWalletId,
  };
};

export default usePayments;
