import { useThemeColors } from "@/hooks/useThemeColor";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import CryptoNetwork from "../svgs/crypto-network";
import USDC from "../svgs/usdc-icon";

const WalletBalance: FunctionComponent = () => {
  const colors = useThemeColors();
  return (
    <View className="flex-row  w-full items-center justify-between">
      <View className="flex-row items-center">
        <View className="relative">
          <CryptoNetwork className="absolute z-10 -left-1 rounded-full bg-white" />
          <USDC />
        </View>
        <View className="ml-4">
          <ResponsiveUi.Text fontSize={18} tailwind="mb-2">
            USD Coin
          </ResponsiveUi.Text>
          <ResponsiveUi.Text color={colors.secondary} light fontSize={18} bold>
            $1,250.00
          </ResponsiveUi.Text>
        </View>
      </View>
      <TouchableOpacity>
        <ResponsiveUi.Text medium fontSize={16} tailwind="ml-4">
          Use Max
        </ResponsiveUi.Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalletBalance;
