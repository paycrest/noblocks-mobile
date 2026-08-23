# Noblocks Mobile — UI Screen Inventory

> **Source of truth:** [Noblocks Mobile (Figma)](https://www.figma.com/design/GCRxGIlmEaLFTPAqZqG7y7/Noblocks-Mobile) — file key `GCRxGIlmEaLFTPAqZqG7y7`, canvas page `V1`.  
> **Setup:** Figma MCP connected — see [FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md).

Last updated: 2026-06-09 (P2 swap polish + keyboard UX)

## Legend

| Status | Meaning |
|--------|---------|
| **match** | Route exists; layout/copy largely aligned with design intent |
| **partial** | Route exists; spacing, typography, or states still differ from Figma |
| **missing** | Figma frame expected but no route |
| **extra** | Route exists; likely obsolete or not in mobile Figma |

## Screen map

| Figma area (expected) | App route | Status | Notes |
|------------------------|-----------|--------|-------|
| Splash / app icon | Native (`app.json` + `assets/images/`) | **match** | Exported from Figma `1:7118`; splash bg `#141414` light + dark |
| Onboarding hero | `(onboarding)/index` | **partial** | Hero asset matched; screen-to-screen transitions pending |
| Login / sign up | `(auth)/login` | **partial** | Legal copy line-break (Terms/Privacy on line 2) pending |
| OTP verification | `(auth)/otp-screen` | **partial** | OTP box spacing vs Figma pending |
| KYC | `(auth)/kyc` | **partial** | SmileID wired in deps; UI parity TBD |
| Create password | `(auth)/create-password` | **extra** | Likely obsolete under Privy OTP — confirm in Figma |
| Auth stub | `(auth)/index` | **extra** | Redirects to login |
| Home / swap | `(tabs)/index` | **partial** | Swap cards, inline numpad, USD estimate, balance guards; light-theme pass TBD |
| Swap recipient | `(home)/swapRecipient` | **match** | Figma `1:7929` — sheet layout, amount pills, 32px card, inputs, CTA |
| Review transaction | `(home)/reviewTransaction` | **match** | Figma `1:5558` — sheet layout, fees help icon, spacing, slate Swap CTA |
| Transaction progress | `(home)/transactionProgress` | **match** | Figma `1:5620` — sheet, countdown, indexing tag, pill flow row |
| Transaction success | `(home)/transactionSuccess` | **match** | Rebuilt vs `1:5684` via `TransactionResultLayout` |
| Transaction failed | `(home)/transactionFailed` | **match** | Rebuilt vs `1:5767` via `TransactionResultLayout` |
| Wallet tab | `(tabs)/wallet` | **partial** | Live multi-chain balances; Withdraw CTA still no-op |
| Smart wallet promo | `(home)/smartWallet` | **partial** | Multi-chain totals in peek; fund copy lists supported networks |
| Transactions list | `(tabs)/transactions` | **partial** | Persisted swap history; detail receipt/explorer links pending |
| Transaction detail | `(transactions)/transactionDetails` | **partial** | Params from list item |
| Settings | `(tabs)/settings` | **partial** | Pixel-perfect pass pending (Figma `1:9666`) |
| Security | `(settings)/security` | **partial** | Pixel-perfect pass + Add 2FA modal + option wiring pending |
| Notifications | `(settings)/notification` | **partial** | Pixel-perfect pass (icons, padding, toggles) pending |
| Tab bar | `(tabs)/_layout` | **partial** | Icon sizes + selected state vs Figma pending |
| Not found | `+not-found` | **match** | Standard expo-router |

## Priority backlog (post-Figma MCP)

### P0 — Auth funnel
- [x] Onboarding: 4-dot page indicator (`1:6712`); Inter 40px + Crimson Pro SemiBold Italic 52px titles; bottom-weight layout; fixed CTA 261×52
- [x] Login: Figma frame `1:7104` — 353×48 input, logo+wordmark, spacing rhythm, legal width 313
- [x] OTP: Figma frame `1:7237` — 44×48 digit boxes, primary focus ring, inline error, Figma copy

### P1 — Swap flow
- [x] Home tab: stepper (`Details` + dots), 24px card radius, crypto-left/fiat-right amount row, numpad 104×48 keys, Continue 361×52
- [x] Home keyboard UX: inline bottom numpad (no modal overlay), **Done** dismiss, tap-outside dismiss, insufficient-balance guard, floored balances for Use max
- [x] Home USD column: token USD estimate via `lib/wallet/tokenUsdValue.ts` (1:1 stables, LiFi `priceUSD`, Paycrest USDC ratio for cNGN)
- [x] Recipient: stepper (`Recipient`), 32px card radius, 48px inputs, slate Continue button
- [x] Review / progress / success / failed: stepper, detail rows, countdown, status copy, CTAs

### P1.5 — UI/UX polish (little fixes)

Small layout and interaction gaps that block “feels like Figma” on device. Audit against [Nobblocks Mobile](https://www.figma.com/design/GCRxGIlmEaLFTPAqZqG7y7/Noblocks-Mobile) before marking done.

#### Auth
- [x] **Login legal copy** — `(auth)/login`: “Terms of Use” and “Privacy Policy” links wrap to a **second line** via `LegalFooter splitLegalLinks` (Figma `1:7104`).
- [x] **OTP box spacing** — `(auth)/otp-screen`: 12px gap between OTP fields; slate focus border (Figma `1:7237`).

#### Navigation & onboarding
- [x] **Tab bar icons** — `(tabs)/_layout`: 32×32 icons, inactive 40% opacity, dedicated transactions icon.
- [x] **Onboarding transitions** — `(onboarding)/index`: 3-slide horizontal pager with fade transitions and synced page indicator.

#### Settings cluster (Figma section `1:9666`)
- [x] **Settings home** — `(tabs)/settings`: 48px profile header, 32px icon badges, 8px row gap, 16px medium labels, live wallet address.
- [x] **Notifications** — `(settings)/notification`: 16px titles, 12px subtitles, 22px row rhythm, full-size toggles.
- [x] **Security** — `(settings)/security`: same row typography/spacing; Face ID toggle wired to passkey enrollment.
- [x] **Add 2FA modal** — `(settings)/security`: **Add 2FA** opens `TwoFAModal` as a bottom sheet (`BaseSheet`).
- [x] **2FA option wiring** — Authenticator → `QRCodeAuthModal` + Privy TOTP enrollment; SMS → Privy SMS enrollment; Face ID → passkey.

#### Transitions (planned — instructions TBD)
- [ ] **App-wide motion** — user will provide follow-up instructions for fluid screen/modal transitions across the app.  
  _Team note: “An app without fluid transitions is a PDF.”_ Defer until spec is shared; do not block P1.5 layout fixes above.

### P2 — Wallet, transactions, settings (data & features)

**Active (2026-06-09).** Core swap + wallet data paths are wired; remaining work is CTAs, detail extras, theme polish, and edge cases.

#### 2.1 Live wallet balances
- [x] **On-chain reads wired** — `hooks/useWalletBalances.ts` + `lib/wallet/balances.ts` (viem RPC); used on Home swap (`useWallet`), Wallet tab, Smart Wallet peek (`app/(home)/smartWallet.tsx`).
- [x] **Swap “Use max” / balance label** — `components/cards/walletBalance.tsx` shows live token balance from selected chain; amounts floored to 2 decimals (never round up).
- [x] **Multi-chain rollup** — `hooks/useAggregatedWalletBalances.ts` fetches all supported swap mainnets in parallel; Wallet tab + Smart Wallet peek show cross-chain totals and per-chain token rows.
- [x] **Paycrest token picker** — `lib/wallet/supportedSwapTokens.ts` (not full LiFi catalog); cNGN on-chain balance + min rate quote (1000).
- [x] **Swap USD estimate** — amount row `$` column shows token USD value (`tokenUsdValue.ts`), not fiat receive amount.
- [ ] **Withdraw CTA** — `(tabs)/wallet.tsx` **Withdraw** button is a no-op.
- [ ] **Settings profile fallback** — shows “Wallet not connected” when logged out; consider hiding row or CTA.
- [ ] **Wallet tab USD column** — non-stables still show `--`; align with swap USD logic or document as v2.

#### 2.2 Real transaction history
- [x] **Persist orders on swap** — `store/slices/transactionHistorySlice.ts`; upsert on order create in `reviewTransaction`.
- [x] **Update status on terminal poll** — `transactionProgress` maps Paycrest terminal status → Completed/Failed.
- [x] **Transactions tab** — `(tabs)/transactions.tsx` reads persisted history; empty state when none.
- [x] **Transaction detail** — `(transactions)/transactionDetails.tsx` shows stored recipient/bank/memo/order id.
- [ ] **Paycrest list API (optional)** — no mobile list endpoint wired today; local persistence is v1. Reconcile/hydrate from API if/when available.
- [ ] **Detail extras** — onchain receipt link, fund status, time spent, Get receipt CTA still placeholders.

#### 2.3 Settings theme picker vs Figma tokens
- [x] **Theme modal exists** — `components/modals/ThemeModal.tsx` (Dark / Light / System) persists via `store/slices/generalSlice.ts` + `useResolvedTheme`.
- [ ] **Figma frame parity** — audit Appearance sheet vs Figma settings tokens (`1:9666`): modal radius/padding, row spacing, icon sizes, selected checkmark color.
- [ ] **Light theme sweep** — Home swap noted “light-theme duplicate TBD” in screen map; verify all P1 screens in light mode after token pass.
- [ ] **System theme edge cases** — confirm status bar / tab bar / sheet surfaces follow resolved scheme on iOS.

#### P2 exit criteria
- Wallet tab and Smart Wallet show live balances for connected user (no sample placeholders).
- Transactions tab lists real swaps from device storage; detail screen shows stored recipient/bank data.
- Appearance picker matches Figma layout and correctly toggles light/dark/system across main tabs.

### P3 — Modals & edge cases
- [ ] Empty wallet / empty transactions
- [ ] Rate fetch errors, network offline
- [ ] KYC failure / retry

## Route index (23 screens)

```
app/index.tsx                          → redirect onboarding | tabs | login
app/(onboarding)/index.tsx
app/(auth)/login.tsx
app/(auth)/otp-screen.tsx
app/(auth)/kyc.tsx
app/(auth)/create-password.tsx
app/(auth)/index.tsx                   → redirect login
app/(tabs)/index.tsx                   → home / swap
app/(tabs)/wallet.tsx
app/(tabs)/transactions.tsx
app/(tabs)/settings.tsx
app/(home)/swapRecipient.tsx
app/(home)/reviewTransaction.tsx
app/(home)/transactionProgress.tsx
app/(home)/transactionSuccess.tsx
app/(home)/transactionFailed.tsx
app/(home)/smartWallet.tsx
app/(transactions)/transactionDetails.tsx
app/(settings)/security.tsx
app/(settings)/notification.tsx
app/+not-found.tsx
```

## Figma section map (page `V1`)

| Section | Node ID | App routes |
|---------|---------|------------|
| Onboarding | `1:6692` | `(onboarding)/index` |
| Auth Screens | `1:7103` | `(auth)/login`, `(auth)/otp-screen`, `(auth)/kyc` |
| Swap Flow | `1:5012` | `(tabs)/index` |
| Beneficiary | `1:7928` | `(home)/swapRecipient` |
| Wallet (swap preview) | `1:8690` | `(tabs)/wallet`, `(home)/smartWallet` |
| Transactions and Wallet | `1:13991` | `(tabs)/transactions`, `(transactions)/transactionDetails` |
| Settings | `1:9666` | `(tabs)/settings`, `(settings)/security`, `(settings)/notification` |
| Export Wallet | `1:14451` | `(home)/smartWallet` (export flow) |

Duplicate light-theme sections exist at positive x-offset (e.g. `1:6896`, `1:7519`).

## Onboarding parity audit — Figma `1:6693` vs `(onboarding)/index`

Audited via Figma MCP `get_design_context` on 2026-06-07. **Implemented** in code; illustration asset export still pending.

| Element | Figma spec | Code today | Gap |
|---------|------------|------------|-----|
| Page indicator | 4 dots; active `#8B85F4` 26×8px pill | `OnboardingPageIndicator` | ✓ |
| Title line 1 | Inter Semi Bold **40px** — "Crypto to Fiat" | Matched | ✓ |
| Title line 2 | Crimson Pro **SemiBold Italic 52px** — "Easy-peeazzy" | Matched | ✓ |
| Body | Inter Regular **16px**, `#FFFFFFCC`, width 293 | Matched | ✓ |
| CTA | **261×52px**, `#5D5DC9`, radius 50px, 18px semibold | Matched | ✓ |
| Legal footer | 12px, `#FFFFFF80`, width 233 | Matched | Minor width |
| Illustration | Multi-layer vector art | `onboarding-hero.png` from Figma | ✓ |
| Layout | Bottom-weighted | Matched | ✓ |

**Copy note:** Figma body text reads "Converting your crypto **to** has never been easier" (missing "fiat"). Code keeps the corrected "crypto **to fiat**" wording.

## Swap flow parity audit — Figma `1:5012` vs `(tabs)/index`

Audited via Figma MCP Dev seat on 2026-06-07 (`1:5021` idle, `1:5050` keyboard).

| Element | Figma spec | Code (after fix) |
|---------|------------|------------------|
| Stepper (idle) | `Details` pill + 3 dots (12px, `#8B85F4` border) | `SwapFlowStepper` when keyboard hidden |
| Stepper (keyboard) | `Details` + 2 dots + wallet + close | `SwapFlowStepper` when inline numpad open |
| Title row | "Swap" 20px semibold + Base chain pill | `SwapChainRow` |
| Send card | 24px radius, 44px token icon, 16/14px labels, "Use max" | `WalletBalance` |
| Amount row | `USDC` + amount (16px) \| **token USD** `$` (24px) | `SwapInput` + `tokenUsdValue` |
| Swap chevron | 28×28 circle between cards | Matched |
| Receive card | fiat receive amount (NGN/KES) | `CurrencySelector` `rightValue` |
| Numpad | 104×48 keys, **Done** top-right, inline bottom panel | `CustomKeyBoard` (not `BottomSheetModal`) |
| Continue | 361×52, `#8B85F4`, disabled when empty / insufficient balance | `CustomKeyBoard` |
| Rate row | `1 USDC → rate` (reference quote, not user amount) | Paycrest `getReferenceRateQuoteAmount` |
| Tab bar | Hidden when keyboard or smart-wallet peek open | `keyboardVisible` route param in `(tabs)/_layout` |

## Beneficiary parity audit — Figma `1:7929` vs `(home)/swapRecipient`

Audited via Figma MCP Dev seat on 2026-06-07.

| Element | Figma spec | Code (after fix) |
|---------|------------|------------------|
| Layout | Grey chrome + `#141414` bottom sheet (40px radius) | `canvas_background` + `SwapScreenSheet` |
| Stepper | dot + `Recipient` pill + dot + wallet + close | `SwapFlowStepper` (header) |
| Swap row | 20px semibold + static Base pill | `SwapChainRow` |
| Amount pills | 52×20px radius, 24px icons, 16px values, 12px gap | Matched |
| Arrow chip | 20px centered between pills | Absolute `ChevronRight` |
| Add recipient card | 32px radius, centered title, 16px side padding | Matched |
| Bank input | 48px height, 16px radius, placeholder `Select bank` | Matched |
| Account input | 48px height, placeholder `Account number` | Matched |
| Person placeholder | 60px circle when idle | `PersonIcon` in 60px disc |
| Beneficiary row | 24px card, dashed icon, gray Select pill | `AddBeneficiaryCard` |
| Continue | 361×52, `#5D5DC9` slate, 40% disabled | `ResponsiveUi.Button` |

## Review / progress / success / failed — Figma vs app routes

Audited via Figma MCP Dev seat on 2026-06-07.

### Review — `1:5558` vs `(home)/reviewTransaction`

| Element | Figma spec | Code (after fix) |
|---------|------------|------------------|
| Layout | 40px top-radius bottom sheet on canvas | `SwapScreenSheet` + `canvas_background` |
| Stepper | 2 dots + `Review` pill + wallet + close | `SwapFlowStepper` (screen header) |
| Swap row + back | 20px semibold title, static chain pill, 28px back | `SwapChainRow` + touchable `BackArrow` |
| Title | "Review transaction" 20px medium + 14px subtitle | Matched |
| Detail rows | 14px label/value, 16px gap, token/fiat icons | `DetailRow` |
| Fees | help-circle icon beside label | `CircleHelp` + alert tooltip |
| Account | number • bank (6px dot) | `AccountValue` |
| Disclaimer | 14px secondary, centered, max 279px | Matched |
| CTA | "Swap" 361×52 `#5D5DC9` | Matched |

### Progress — `1:5620` vs `(home)/transactionProgress`

| Element | Figma spec | Code |
|---------|------------|------|
| Sheet | `#141414` canvas, 40px radius, 0.5px border | `BaseSheet` + `surface_canvas` |
| Countdown | 231px ring, 44px bold + 14px "Sec" | `AnimatedCircularProgress` + timer |
| Indexing tag | yellow `#F2C71C` pill + 16px spinner | Matched |
| Title | 20px medium, white 80% | Matched |
| Flow row | 14px token pill + 9px dot connector + recipient pill | `TransactionFlowRow` |
| Body copy | 14px secondary processing message | Matched |

### Success — `1:5684` vs `(home)/transactionSuccess`

| Element | Figma spec | Code (after fix) |
|---------|------------|------------------|
| Icon + title | 40px check + "Transaction successful" 20px | Matched |
| Background | green `#39C65D` | Matched |
| CTAs | Get receipt + New payment 52px | Matched; **New payment → home** (bug fix) |

### Failed — `1:5767` vs `(home)/transactionFailed`

| Element | Figma spec | Code (after fix) |
|---------|------------|------------------|
| Icon + title | 40px cancel + "Oops! Transaction failed" 20px | Matched |
| Reason card | bordered box with failure copy | Present |
| CTA | Retry 52px slate | Matched |

## Auth parity audit — Figma `1:7104` / `1:7237` vs login / OTP

Audited via Figma metadata export on 2026-06-07.

| Element | Figma spec | Code (after fix) |
|---------|------------|------------------|
| Header | 36×36 logo + "Noblocks" wordmark (~36px lh) | `Logo` component |
| Login subtitle | "Login or sign up", 16/24, y-gap 29px | Matched |
| Email input | 353×48, placeholder `your@email.com` | Matched |
| Legal | 313px wide, below input (y+29) | Matched |
| OTP title | "Enter OTP code sent to your mail" | Matched (removed extra masked-email line) |
| OTP boxes | 6× 44×48, primary focus border | Matched |
| Resend | "Didn't receive a code? Resend" 16/24 | Matched with cooldown |
| OTP legal footer | Not in Figma frame | Removed from OTP screen |

Password frames in Figma (`1:7183`+) are **obsolete** under Privy OTP — routes redirect to login.

## Design tokens (Figma variables vs code)

| Token | Figma variable | Figma value | `constants/Colors.ts` | Match |
|-------|----------------|-------------|------------------------|-------|
| Background | — | `#141414` | `backgroundDark` `#141414` | ✓ |
| Primary | `--lavender-blue-shadow/500_base` | `#8B85F4` | `primary` `#8B85F4` | ✓ |
| Button / slate | `--main/slate` | `#5D5DC9` | `slate` `#5D5DC9` | ✓ |
| Body text | `--color/text/body` | `rgba(255,255,255,0.8)` | `secondaryDark` `#FFFFFF80` | ✓ |
| Legal / secondary | `--color/text/secondary` | `rgba(255,255,255,0.5)` | `secondaryDark` `#FFFFFF80` | Close (code 50% vs 80% on body) |
| Inactive dot | `--color/background/neutral` | `rgba(255,255,255,0.05)` | `neutral_surface` `#FFFFFF0D` | ✓ |
| Fonts | text styles | Inter + Crimson Pro | `hooks/useCustomFonts.ts` | ✓ |

## Next step

1. ~~Connect Figma MCP and paste the mobile file URL.~~ Done — [Nobblocks Mobile](https://www.figma.com/design/GCRxGIlmEaLFTPAqZqG7y7/Nobblocks-Mobile).
2. ~~Frame-by-frame audits for Swap (`1:5012`) and Beneficiary (`1:7928`).~~ Done (Dev seat).
3. ~~Review / progress / success / failed audits.~~ Done (Dev seat).
4. ~~Export onboarding illustration + app icon from Figma assets; verify splash on iOS simulator.~~ Exported — run `pnpm prebuild --platform ios --clean` to refresh native splash.
5. ~~**P1.5 UI/UX polish**~~ — checklist complete; app-wide motion deferred to separate spec.
6. ~~**P2 core data**~~ — on-chain balances, multi-chain rollup, persisted tx history, swap keyboard/USD/balance guards (2026-06-09).
7. **P2 remainder (active)** — Withdraw CTA, transaction detail extras (receipt/explorer), wallet tab USD column parity, theme Figma pass + light-theme sweep.
8. **P3** — empty states, rate/offline errors, KYC retry — in PR-sized chunks on iOS simulator.
9. **Auth funnel (parallel)** — new-account KYC/wallet provisioning after OTP (not in screen map yet).
10. **Motion pass (later)** — user will supply transition specs; separate track from layout fixes.

**Figma seat:** Viewer OK for audits; re-enable Dev seat for settings/security or light-theme frames.
