import Tether from "@/components/svgs/tether";
import USDC from "@/components/svgs/usdc-icon";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { ResponsiveUi } from "@/components/ResponsiveUi";

const TOKEN_ICONS: Record<
  string,
  React.FC<{ width: number; height: number }>
> = {
  USDC,
  USDT: Tether,
};

interface AmountPillIconProps {
  symbol?: string;
  uri?: string;
  size?: number;
}

const AmountPillIcon: React.FC<AmountPillIconProps> = ({
  symbol,
  uri,
  size = 24,
}) => {
  const colors = useThemeColors();
  const normalizedSymbol = symbol?.trim().toUpperCase() ?? "";
  const LocalIcon = TOKEN_ICONS[normalizedSymbol];

  if (LocalIcon) {
    return <LocalIcon width={size} height={size} />;
  }

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.neutral_surface,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResponsiveUi.Text medium fontSize={Math.max(10, size * 0.35)}>
        {normalizedSymbol.slice(0, 3) || "?"}
      </ResponsiveUi.Text>
    </View>
  );
};

export default AmountPillIcon;
