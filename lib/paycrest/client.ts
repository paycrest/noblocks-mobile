import { PAYCREST_SENDER_API_KEY } from "@/api/queryConstants";
import { createPaycrestClient, type PaycrestClient } from "@paycrest/sdk";

const DEFAULT_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.paycrest.io/v2";

let client: PaycrestClient | null = null;

export function getPaycrestClient(): PaycrestClient {
  if (!client) {
    client = createPaycrestClient({
      senderApiKey: PAYCREST_SENDER_API_KEY,
      baseUrl: DEFAULT_BASE_URL,
    });
  }

  return client;
}
