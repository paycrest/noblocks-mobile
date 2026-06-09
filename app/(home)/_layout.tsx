import { Stack } from "expo-router";
import React from "react";

import { useThemeColors } from "@/hooks/useThemeColor";

export default function HomeLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: {
          backgroundColor: colors.canvas_background,
        },
      }}
    />
  );
}
