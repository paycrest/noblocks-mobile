import {
  useAuthorizationSignature,
  useEmbeddedEthereumWallet,
  usePrivy,
} from "@privy-io/expo";
import axios from "axios";
import { useMemo, useState } from "react";

const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
const appSecret = process.env.EXPO_PUBLIC_PRIVY_APP_SECRET;
const privyApiBaseUrl =
  process.env.EXPO_PUBLIC_PRIVY_BASE_URL ?? "https://api.privy.io/v1";
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

interface StartSwapAuth {
  appId?: string;
  appSecret: string;
  authorizationSignature?: string;
  idempotencyKey?: string;
}

interface PrivySwapBody {
  caip2: string;
  input_token: string;
  output_token: string;
  amount: string;
  amount_type: "exact_input" | "exact_output";
  slippage_bps?: number;
  recipient?: string;
}

const usePayments = () => {
  const { wallets } = useEmbeddedEthereumWallet();
  const { user } = usePrivy();
  const { generateAuthorizationSignature } = useAuthorizationSignature();
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

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

  const buildIdempotencyKey = () => {
    return `swap-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  };

  async function startSwap(
    params: StartSwapParams,
    auth?: Partial<StartSwapAuth>,
  ): Promise<SwapAction> {
    const resolvedAppId = auth?.appId ?? appId;
    const resolvedAppSecret = auth?.appSecret ?? appSecret;
    const walletId = params.walletId ?? embeddedWalletId;

    if (!resolvedAppId || !resolvedAppSecret) {
      throw new Error("Missing Privy app credentials for swap request.");
    }

    if (!walletId) {
      throw new Error("No embedded wallet found for swap request.");
    }

    const url = `${privyApiBaseUrl}/wallets/${walletId}/swap`;
    const body: PrivySwapBody = {
      caip2: params.caip2,
      input_token: params.inputToken,
      output_token: params.outputToken,
      amount: params.amount,
      amount_type: params.amountType ?? "exact_input",
      ...(params.slippageBps !== undefined
        ? { slippage_bps: params.slippageBps }
        : {}),
      ...(params.recipient ? { recipient: params.recipient } : {}),
    };

    const signingHeaders: {
      "privy-app-id": string;
      "privy-idempotency-key"?: string;
    } = {
      "privy-app-id": resolvedAppId,
      ...(auth?.idempotencyKey
        ? { "privy-idempotency-key": auth.idempotencyKey }
        : { "privy-idempotency-key": buildIdempotencyKey() }),
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

  async function executeSwap(
    params: StartSwapParams,
    auth?: Partial<StartSwapAuth>,
  ): Promise<SwapAction> {
    setIsSwapping(true);
    setSwapError(null);

    try {
      const action = await startSwap(params, auth);
      return action;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data
          ? JSON.stringify(error.response.data)
          : error instanceof Error
            ? error.message
            : "Swap failed. Please try again.";

      setSwapError(message);
      throw error;
    } finally {
      setIsSwapping(false);
    }
  }

  return {
    startSwap,
    executeSwap,
    isSwapping,
    swapError,
    embeddedWalletId,
  };
};

export default usePayments;
