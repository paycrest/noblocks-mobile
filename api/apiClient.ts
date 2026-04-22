import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiError {
  message: string;
  statusCode?: number;
  raw?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

// ---------------------------------------------------------------------------
// Token provider
// Lazy-loaded so there is no circular dependency with the Zustand store.
// ---------------------------------------------------------------------------

let _getToken: (() => string | null | undefined) | null = null;

/**
 * Call this once at app startup (e.g. inside _layout.tsx) to wire up the
 * auth token so every request automatically gets an Authorization header.
 *
 * @example
 *   setTokenProvider(() => store.getState().user?.token);
 */
export const setTokenProvider = (provider: () => string | null | undefined) => {
  _getToken = provider;
};

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://api.paycrest.io/v2";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach auth token + optional API key
// ---------------------------------------------------------------------------

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const existingAuthorization =
      config.headers.get("Authorization") ??
      config.headers.get("authorization");
    const token = _getToken?.();
    if (token && !existingAuthorization) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers.set("x-api-key", apiKey);
    }

    if (__DEV__) {
      console.log(
        `[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        config.params ?? "",
      );
    }

    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error("[API] Request error:", error.message);
    }
    return Promise.reject(normaliseError(error));
  },
);

// ---------------------------------------------------------------------------
// Response interceptor — unwrap data, log, normalise errors
// ---------------------------------------------------------------------------

client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
    }
    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.log(
        `[API] ← ERROR ${error.response?.status ?? "network"} ${error.config?.url}`,
        error.response?.data ?? error.message,
      );
    }
    return Promise.reject(normaliseError(error));
  },
);

// ---------------------------------------------------------------------------
// Error normaliser
// ---------------------------------------------------------------------------

function normaliseError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as Record<string, unknown> | undefined;
    const message =
      (data?.message as string) ??
      (data?.error as string) ??
      `Request failed with status ${error.response.status}`;

    return {
      message,
      statusCode: error.response.status,
      raw: data,
    };
  }

  if (error.request) {
    return {
      message: "No response from server. Check your internet connection.",
      raw: error.request,
    };
  }

  return {
    message: error.message ?? "An unexpected error occurred.",
    raw: error,
  };
}

// ---------------------------------------------------------------------------
// Convenience methods
// ---------------------------------------------------------------------------

export async function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.get<T>(url, config);
  return response.data;
}

export async function post<T = unknown>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.post<T>(url, body, config);
  return response.data;
}

export async function put<T = unknown>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.put<T>(url, body, config);
  return response.data;
}

export async function patch<T = unknown>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.patch<T>(url, body, config);
  return response.data;
}

export async function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await client.delete<T>(url, config);
  return response.data;
}

export default client;
