# Noblocks Mobile

The mobile client for [Paycrest](https://paycrest.io), built with [Expo](https://expo.dev) (SDK 53) and React Native. The app uses Privy for embedded wallets and authentication, Paycrest for swap/payout orders, and LiFi for chain/token metadata.

## Requirements

- Node 20+ and Yarn (or npm)
- Watchman (macOS) — `brew install watchman`
- Xcode 15+ and CocoaPods for iOS
- Android Studio + JDK 17 for Android
- [EAS CLI](https://docs.expo.dev/eas-update/getting-started/) for cloud builds: `npm install -g eas-cli`
- [Expo Orbit](https://expo.dev/orbit) (optional, useful for installing dev builds on simulators)

## Quick start

```bash
# 1. Install deps
yarn install

# 2. Create your local env file from the template
cp .env.example .env
# …then fill in the values (see "Environment variables" below)

# 3. Generate native projects if missing, then start the dev client
yarn prebuild
yarn ios     # or: yarn android
yarn start   # Metro bundler; opens a dev-client build
```

> The first `yarn ios` / `yarn android` will compile a native dev client. After that, `yarn start` is enough.

## Environments

There are three environments: **development**, **staging**, and **production**. They share the same bundle identifier (`com.paycrest.noblocks`), so only one variant can be installed on a device at a time. They differ only by environment variables and EAS build channel.

| Environment | EAS profile  | Channel       | Notes                                      |
| ----------- | ------------ | ------------- | ------------------------------------------ |
| Development | `development`| `development` | Dev client, internal distribution, simulator-friendly |
| Staging     | `staging`    | `staging`     | Internal distribution (APK / ad-hoc iOS)   |
| Production  | `production` | `production`  | App Store / Play Store, auto-incremented version |

### Environment variables

All variables are documented in [`.env.example`](./.env.example). The codebase reads them via `process.env.EXPO_PUBLIC_*` (see `api/queryConstants.ts`, `api/apiClient.ts`, `app/_layout.tsx`).

| Variable                        | Description                                |
| ------------------------------- | ------------------------------------------ |
| `EXPO_PUBLIC_APP_ENV`           | One of `development` / `staging` / `production` |
| `EXPO_PUBLIC_API_BASE_URL`      | Paycrest API base URL                      |
| `EXPO_PUBLIC_API_KEY`           | Paycrest API key                           |
| `EXPO_PUBLIC_PRIVY_BASE_URL`    | Privy REST base URL                        |
| `EXPO_PUBLIC_PRIVY_APP_ID`      | Privy app ID                               |
| `EXPO_PUBLIC_PRIVY_CLIENT_ID`   | Privy client ID                            |
| `EXPO_PUBLIC_PRIVY_APP_SECRET`  | Privy app secret (inlined — handle with care) |

> Anything prefixed with `EXPO_PUBLIC_` is inlined into the JS bundle and shipped to users' devices. Do not put true server-only secrets in this app.

### Local env switching

Expo's bundler auto-loads `.env`, `.env.local`, `.env.development`, `.env.development.local`, `.env.production`, `.env.production.local` based on `NODE_ENV` (see [Expo env vars](https://docs.expo.dev/guides/environment-variables/)).

For day-to-day local development against the dev API, keep your values in `.env` (or `.env.development`). To run a local build pointed at staging or production, override per-shell:

```bash
# Point local dev at staging API
cp .env.example .env.staging   # fill in staging values
cp .env.staging .env           # use it as the active env
yarn start
```

## EAS Build

The three build profiles live in [`eas.json`](./eas.json). Each profile sets `APP_ENV` / `EXPO_PUBLIC_APP_ENV` automatically.

```bash
# Authenticate once
eas login

# Link this repo to your EAS project (writes extra.eas.projectId)
eas init

# Create a build per environment
eas build --profile development --platform ios
eas build --profile staging     --platform android
eas build --profile production  --platform all
```

### Providing env values to EAS Build

`EXPO_PUBLIC_*` variables must exist in the build environment when EAS compiles the JS bundle. Choose one of:

1. **EAS environment variables (recommended)** — store per-environment values in the EAS dashboard or via the CLI:
   ```bash
   eas env:create --environment preview --name EXPO_PUBLIC_PRIVY_APP_ID --value <value>
   ```
2. **Inline in `eas.json`** — add non-sensitive values directly under each profile's `env` block.
3. **Local `.env.<profile>` file** — present when running `eas build` locally; EAS will pick it up via Expo's dotenv loader.

### OTA updates (optional)

The build profiles already declare `channel` values, so [EAS Update](https://docs.expo.dev/eas-update/getting-started/) just needs to be wired into `app.json`:

```bash
eas update:configure
eas update --branch staging    --message "Fix bottom sheet on small screens"
eas update --branch production --message "Hotfix"
```

## Project structure

```
app/             Expo Router screens (file-based routing)
api/             Axios client, query functions, types
components/      Shared UI
hooks/           Custom hooks (auth, payments, dimensions, fonts)
constants/       Colors, Size scale
utils/           Helpers (privy, sample data, styles)
assets/          Fonts and images
ios/, android/   Native projects (regenerated via `yarn prebuild`)
patches/         Patch-package patches applied on postinstall
schema/          Yup validation schemas
scripts/         Maintenance scripts
```

## Scripts

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `yarn start`       | Start Metro and open a dev client             |
| `yarn ios`         | Build and run on the iOS simulator/device     |
| `yarn android`     | Build and run on the Android emulator/device  |
| `yarn web`         | Run the web target                            |
| `yarn lint`        | ESLint                                        |
| `yarn prebuild`    | Regenerate `ios/` and `android/` from config  |

## Troubleshooting

- **`process.env.EXPO_PUBLIC_*` is `undefined`** — your `.env` file isn't loaded. Restart Metro with `expo start --clear`.
- **Privy errors on launch** — make sure `EXPO_PUBLIC_PRIVY_APP_ID` and `EXPO_PUBLIC_PRIVY_CLIENT_ID` match the environment you're pointing at.
- **`eas build` rejects the project** — run `eas init` to write your project ID into `app.json#extra.eas.projectId`.

## Learn more

- [Expo docs](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Privy Expo SDK](https://docs.privy.io/guide/expo)
- [Paycrest API](https://paycrest.io/docs)
