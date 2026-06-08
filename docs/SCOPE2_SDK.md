# Scope 2 — Privy + Paycrest SDK integration

Mobile off-ramp parity with Noblocks web (`agentic-web/`).

## Implemented (this pass)

| Capability | Mobile | Web reference |
|------------|--------|---------------|
| Privy email OTP login | `hooks/auth/useAuth.tsx`, `(auth)/login`, `(auth)/otp-screen` | Privy Expo SDK |
| **On-chain wallet balances** | `lib/wallet/*`, `hooks/useWalletBalances.ts`, `hooks/useWallet.ts` | `agentic-web/app/context/BalanceContext.tsx`, `utils.ts` |
| **`@paycrest/sdk` (v1.0.0)** | `lib/paycrest/client.ts` → `api/queryFns.ts` adapters | Official SDK sender client |
| Paycrest rate (off-ramp) | `fetchPaycrestRate` → `client.sender().getTokenRate` | `agentic-web/app/api/aggregator.ts` |
| Verify bank account | `verifyPaycrestAccount` → `client.sender().verifyAccount` | Same v2 API |
| Create sender order | `createPaycrestSenderOrder` → `client.sender().createOfframpOrder` | POST `/v2/sender/orders` |
| Order status polling | `fetchPaycrestOrderStatus` → `client.sender().getOrder` | `fetchOrderDetails` |
| Review → progress flow | `reviewTransaction` creates order, passes `orderId` | `TransactionPreview` |

### On-chain balance approach

After Privy auth, mobile reads embedded wallet address via `useWalletAddress` and fetches token balances with **viem** (`fetchEvmWalletBalances`), matching web:

- Token list from Paycrest `GET /tokens` with `lib/wallet/fallbackTokens.ts` fallback
- RPC via `EXPO_PUBLIC_RPC_URL_KEY` (Dwellir) or public endpoints per chain (`lib/wallet/rpc.ts`)
- Wired to Home/Swap (`useWallet`), Wallet tab, and Smart Wallet sheet

## Environment

Set in `.env.local`:

- `EXPO_PUBLIC_API_BASE_URL` — Paycrest aggregator v2 base
- `EXPO_PUBLIC_SENDER_API_KEY` — Paycrest sender API key ID (order create/status)
- `EXPO_PUBLIC_PRIVY_APP_ID` / `EXPO_PUBLIC_PRIVY_CLIENT_ID`
- `EXPO_PUBLIC_RPC_URL_KEY` — optional Dwellir RPC key (recommended for production reads)
- `EXPO_PUBLIC_PRIVY_APP_SECRET` — legacy Privy balance API (no longer used for balances)

### SDK notes

- Package: `@paycrest/sdk@1.0.0` (first mobile integration)
- Metro shim: `shims/node-crypto.js` maps `node:crypto` → `expo-crypto` for RN
- Gateway off-ramp (`method: 'gateway'`) deferred — needs viem signer wiring from Privy embedded wallet

## Deferred (follow-up)

- **Cross-chain balance rollup** — web `BalanceContext` aggregates multiple networks; mobile fetches per selected chain today
- **On-ramp (`side: buy`)** — web `TransactionForm` buy tab; mobile home tab is sell-only today
- **On-chain off-ramp** — gateway order IDs + network-scoped status (`GET /v2/orders/:chainId/:id`)
- **Pubkey encryption** — web order payload encryption before submit
- **Live transaction history** — replace `utils/sampleData` with persisted orders
- **Privy swap / transfer** — `startPrivySwap` scaffold exists; not wired to UI

## Testing off-ramp (iOS simulator)

1. Log in with Privy OTP
2. Home tab: select chain, asset, fiat, amount — balance label should reflect on-chain reads
3. Wallet tab / Smart Wallet: totals and token rows update from Base (default) balances
4. Continue → recipient → review → Swap
5. Progress screen polls until terminal status (`settled`, `validated`, `failed`, etc.)
