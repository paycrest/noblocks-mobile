import { Redirect } from "expo-router";

/** Obsolete under Privy OTP — kept as route guard redirect. */
export default function CreatePasswordScreen() {
  return <Redirect href="/(auth)/login" />;
}
