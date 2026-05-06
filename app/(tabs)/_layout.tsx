import HomeIcon from "@/components/svgs/home-icon";
import SettingsIcon from "@/components/svgs/settings-icon";
import WalletIcon from "@/components/svgs/wallet-icon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import {
  Tabs,
  useGlobalSearchParams,
  usePathname,
  useSegments,
} from "expo-router";
import { Clock } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const colors = useThemeColors();
  const segments = useSegments();
  const params = useGlobalSearchParams();
  const pathname = usePathname();

  const isSmartWalletVisible = params.smartWalletVisible === "true";
  const isKeyboardVisible = params.keyboardVisible === "true";

  // Are we on the home/swap screen?
  const isOnHome = segments[0] === "(tabs)" && pathname === "/";
  const shouldHideTabs =
    isOnHome && (isSmartWalletVisible || isKeyboardVisible);
  const { hp } = useAppDimensions();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.slate,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarIconStyle: {
          marginTop: hp(1),
        },
        tabBarStyle: shouldHideTabs
          ? { display: "none" }
          : Platform.select({
              ios: {
                position: "absolute",
                backgroundColor: "transparent",
              },
              default: {
                backgroundColor: colors.background,
              },
            }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <WalletIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Clock color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
