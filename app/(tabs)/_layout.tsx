import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import HomeIcon from "@/components/svgs/home-icon";
import SettingsIcon from "@/components/svgs/settings-icon";
import TransactionsIcon from "@/components/svgs/transactions-icon";
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
        tabBarInactiveTintColor: colors.text,
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
                backgroundColor: colors.surface_canvas,
                borderTopWidth: 0.5,
                borderTopColor: colors.subtle_surface,
              },
              default: {
                backgroundColor: colors.surface_canvas,
                borderTopWidth: 0.5,
                borderTopColor: colors.subtle_surface,
              },
            }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <HomeIcon color={color} focused={focused} width={32} height={32} />
            </TabBarIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <WalletIcon color={color} focused={focused} width={32} height={32} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <TransactionsIcon
                color={color}
                focused={focused}
                width={32}
                height={32}
              />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused}>
              <SettingsIcon
                color={color}
                focused={focused}
                width={32}
                height={32}
              />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}
