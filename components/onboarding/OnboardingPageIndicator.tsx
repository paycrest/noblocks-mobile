import React from "react";
import { View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";

type Props = {
  activeIndex?: number;
  total?: number;
};

export default function OnboardingPageIndicator({
  activeIndex = 0,
  total = 4,
}: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        height: 8,
      }}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <View
            key={index}
            style={{
              width: isActive ? 26 : 12,
              height: 8,
              borderRadius: 4,
              backgroundColor: isActive ? colors.primary : colors.neutral_surface,
            }}
          />
        );
      })}
    </View>
  );
}
