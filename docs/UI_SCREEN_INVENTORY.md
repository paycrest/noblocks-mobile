# Noblocks Mobile — UI Screen Inventory

> **Source of truth:** [Noblocks Mobile (Figma)](https://www.figma.com/design/GCRxGIlmEaLFTPAqZqG7y7/Noblocks-Mobile) — file key `GCRxGIlmEaLFTPAqZqG7y7`, canvas page `V1`.  
> **Setup:** Figma MCP connected — see [FIGMA_MCP_SETUP.md](./FIGMA_MCP_SETUP.md).

Last updated: 2026-06-07

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
| Onboarding hero | `(onboarding)/index` | **match** | Figma `1:6693` crop → `onboarding-hero.png` (340×197) |
| Login / sign up | `(auth)/login` | **partial** | Aligned to `1:7104` spacing and sizing; verify on simulator |
| OTP verification | `(auth)/otp-screen` | **partial** | Aligned to `1:7237` copy, 44×48 boxes, inline error |
| KYC | `(auth)/kyc` | **partial** | SmileID wired in deps; UI parity TBD |
| Create password | `(auth)/create-password` | **extra** | Likely obsolete under Privy OTP — confirm in Figma |
| Auth stub | `(auth)/index` | **extra** | Redirects to login |
| Home / swap | `(tabs)/index` | **partial** | Audited vs `1:5021`/`1:5050`; stepper, cards, numpad aligned; light-theme duplicate TBD |
| Swap recipient | `(home)/swapRecipient` | **match** | Figma `1:7929` — sheet layout, amount pills, 32px card, inputs, CTA |
| Review transaction | `(home)/reviewTransaction` | **match** | Figma `1:5558` — sheet layout, fees help icon, spacing, slate Swap CTA |
| Transaction progress | `(home)/transactionProgress` | **match** | Figma `1:5620` — sheet, countdown, indexing tag, pill flow row |
| Transaction success | `(home)/transactionSuccess` | **partial** | Audited vs `1:5684`; icon/title, CTA fix (New payment → home) |
| Transaction failed | `(home)/transactionFailed` | **partial** | Audited vs `1:5767`; title/icon, retry CTA aligned |
| Smart wallet promo | `(home)/smartWallet` | **partial** | Embedded in home tab sheet |
| Wallet tab | `(tabs)/wallet` | **partial** | Sample balances; theme tokens fixed |
| Transactions list | `(tabs)/transactions` | **partial** | Sample data; theme tokens fixed |
| Transaction detail | `(transactions)/transactionDetails` | **partial** | Params from list item |
| Settings | `(tabs)/settings` | **partial** | Theme modal + navigation |
| Security | `(settings)/security` | **partial** | Passkey / biometrics TBD |
| Notifications | `(settings)/notification` | **partial** | Placeholder |
| Tab bar | `(tabs)/_layout` | **partial** | Custom icons |
| Not found | `+not-found` | **match** | Standard expo-router |

## Priority backlog (post-Figma MCP)

### P0 — Auth funnel
- [x] Onboarding: 4-dot page indicator (`1:6712`); Inter 40px + Crimson Pro SemiBold Italic 52px titles; bottom-weight layout; fixed CTA 261×52
- [x] Login: Figma frame `1:7104` — 353×48 input, logo+wordmark, spacing rhythm, legal width 313
- [x] OTP: Figma frame `1:7237` — 44×48 digit boxes, primary focus ring, inline error, Figma copy

### P1 — Swap flow
- [x] Home tab: stepper (`Details` + dots), 24px card radius, crypto-left/fiat-right amount row, numpad 104×48 keys, Continue 361×52
- [x] Recipient: stepper (`Recipient`), 32px card radius, 48px inputs, slate Continue button
- [x] Review / progress / success / failed: stepper, detail rows, countdown, status copy, CTAs

### P2 — Wallet, transactions, settings
- [ ] Wallet: live Privy balances vs placeholders
- [ ] Transactions: real order history vs `utils/sampleData`
- [ ] Settings: theme picker vs Figma tokens

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
| Stepper (idle) | `Details` pill + 3 dots (12px, `#8B85F4` border) | `SwapFlowStepper` |
| Stepper (keyboard) | `Details` + 2 dots + wallet + close | `SwapFlowStepper` with actions |
| Title row | "Swap" 20px semibold + Base chain pill | `SwapChainRow` |
| Send card | 24px radius, 44px token icon, 16/14px labels, "Use max" | `WalletBalance` |
| Amount row | `USDC` + amount (16px) \| `$fiat` (24px) | `SwapInput` |
| Swap chevron | 28×28 circle between cards | Matched |
| Receive card | "Receive" / "Select currency" + Select pill | `CurrencySelector` |
| Numpad | 104×48 keys, 12px gap/radius, 28px semibold | `CustomKeyBoard` |
| Continue | 361×52, `#8B85F4`, 18px semibold, 40% when disabled | `CustomKeyBoard` |
| Rate row | `1 USDC → rate` | Present below cards |

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

1. ~~Connect Figma MCP and paste the mobile file URL.~~ Done — [Nobblocks Mobile](https://www.figma.com/design/GCRxGIlmEaLFTPAqZqG7y7/Noblocks-Mobile).
2. ~~Frame-by-frame audits for Swap (`1:5012`) and Beneficiary (`1:7928`).~~ Done (Dev seat).
3. ~~Review / progress / success / failed audits.~~ Done (Dev seat).
4. ~~Export onboarding illustration + app icon from Figma assets; verify splash on iOS simulator.~~ Exported — run `pnpm prebuild --platform ios --clean` to refresh native splash.
5. Work P2/P3 in PR-sized chunks on iOS simulator only.

**Figma seat:** Safe to downgrade to **Viewer** — MCP audits and asset exports are complete.
