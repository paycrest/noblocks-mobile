# Scope 4 — AOB (Android, observability, EAS)

Non-functional and infra tasks deferred from Scope 1–3.

## Android prebuild

**Status:** JVM 17 override added in `android/build.gradle`. `local.properties` points at SDK.

**Known issue:** Stale Expo autolinking / `ExpoModulesPackage` after SDK upgrades.

**Recovery steps:**

```bash
npx expo prebuild --platform android --clean
cd android && ./gradlew :app:assembleDebug
```

If autolinking still fails, delete `android/` and re-run prebuild from a clean tree.

## iOS (current debug target)

```bash
npx expo prebuild --platform ios --clean
pnpm ios
```

Bundle ID: `xyz.noblocks.app`

## EAS profiles

Configured in `eas.json`:

| Profile | Channel | Use |
|---------|---------|-----|
| `development` | development | Dev client, iOS simulator builds |
| `staging` | staging | Internal QA |
| `production` | production | Store releases, auto-increment |

Env vars: `APP_ENV`, `EXPO_PUBLIC_APP_ENV` per profile.

## Observability

### Reactotron (local dev)

- Config: `ReactotronConfig.js`
- Loaded from `app/_layout.tsx` in `__DEV__`
- Run [Reactotron desktop](https://github.com/infinitered/reactotron) while Metro is up

### Datadog (production — optional)

Datadog MCP is available in Cursor (`plugin-datadog-datadog`). For mobile RUM/logs, add `@datadog/mobile-react-native` in a follow-up PR and wire DSN via EAS secrets — not included in Scope 1 to avoid scope creep.

## Deep links & associated domains

- iOS associated domain: `webcredentials:roosta-landing-page.vercel.app` (update when production domain is final)
- Passkey RP: see `app.json` `extra.passkeyAssociatedDomain`
- Universal links: `apple-app-site-association.json`, `assetlinks.json` at repo root

## Privy dashboard

Ensure `xyz.noblocks.app` is registered for:
- iOS bundle ID
- Android package name
- OAuth / OTP redirect URLs used by Expo dev client

## CI suggestion

```yaml
# Example only — add to repo CI when ready
- run: pnpm lint && pnpm tsc --noEmit
- run: npx expo prebuild --platform ios --no-install
```
