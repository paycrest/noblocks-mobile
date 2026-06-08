import "react-native-get-random-values"; // Must be first
import "react-native-reanimated"; // Keep this after polyfills

if (__DEV__) {
  require("../ReactotronConfig");
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { queryClient } from "@/api/queryClient";
import useCustomFonts from "@/hooks/useCustomFonts";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PrivyProvider } from "@privy-io/expo";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { loaded } = useCustomFonts();
  const resolvedTheme = useResolvedTheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const app_id = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
  const client_id = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID;

  return (
    <View className={resolvedTheme === "dark" ? "dark flex-1" : "flex-1"}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <PrivyProvider appId={app_id ?? ""} clientId={client_id ?? ""}>
            <ThemeProvider
              value={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <BottomSheetModalProvider>
                <PaperProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(onboarding)/index" />
                    <Stack.Screen name="(auth)/login" />
                    <Stack.Screen name="(auth)/otp-screen" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </PaperProvider>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </PrivyProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </View>
  );
}
