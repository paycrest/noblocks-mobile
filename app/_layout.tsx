import "react-native-get-random-values"; // Must be first
import "react-native-reanimated"; // Keep this after polyfills

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import useCustomFonts from "@/hooks/useCustomFonts";
import { PrivyProvider } from "@privy-io/expo"; // Uncomment now
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { useSelector } from "./store/Store";

export default function RootLayout() {
  const { loaded } = useCustomFonts();
  const { appTheme } = useSelector(["appTheme"]);

  if (!loaded) {
    return null;
  }

  const app_id = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
  const client_id = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID;

  return (
    <PrivyProvider appId={app_id ?? ""} clientId={client_id ?? ""}>
      <ThemeProvider value={appTheme === "dark" ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(onboarding)/index" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PaperProvider>
      </ThemeProvider>
    </PrivyProvider>
  );
}
