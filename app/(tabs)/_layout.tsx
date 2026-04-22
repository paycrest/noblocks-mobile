import HomeIcon from "@/components/svgs/home-icon";
import SettingsIcon from "@/components/svgs/settings-icon";
import WalletIcon from "@/components/svgs/wallet-icon";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import { Clock } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.slate,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarIconStyle: {
          marginTop: 15,
        },
        tabBarStyle: Platform.select({
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
        name="history"
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
