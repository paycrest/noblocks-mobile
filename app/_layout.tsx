import "react-native-reanimated";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import useCustomFonts from "@/hooks/useCustomFonts";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { useSelector } from "./store/Store";

export default function RootLayout() {
  const { loaded } = useCustomFonts();
  const {appTheme} = useSelector(["appTheme"])


  if (!loaded) {
    return null;
  }


  return (
    <ThemeProvider value={appTheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)/index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </ThemeProvider>
  );
}
