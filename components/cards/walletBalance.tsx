import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { ChevronDown, Plus } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface WalletBalanceProps {
  selectedAsset?: {
    symbol: string;
    name: string;
    logoURI?: string;
  } | null;
  privyBalanceLabel?: string;
  onAssetPress?: () => void;
  onUseMaxPress?: () => void;
  chainLogoURI?: string;
}

const WalletBalance: FunctionComponent<WalletBalanceProps> = ({
  selectedAsset,
  privyBalanceLabel,
  onAssetPress,
  onUseMaxPress,
  chainLogoURI,
}) => {
  const colors = useThemeColors();

  return (
    <View className="flex-row  w-full items-center justify-between">
      <View className="flex-row items-center">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAssetPress}
          className="flex-row items-center"
        >
          <View style={{ width: 40, height: 40 }}>
            {selectedAsset?.logoURI ? (
              <Image
                source={{ uri: selectedAsset.logoURI }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <View
                style={{ backgroundColor: colors.secondary }}
                className="w-10 h-10 rounded-full items-center justify-center"
              >
                <Plus size={18} color={colors.text} />
              </View>
            )}
            {chainLogoURI ? (
              <Image
                source={{ uri: chainLogoURI }}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  position: "absolute",
                  top: 0,
                  left: -2,
                  borderWidth: 1.5,
                  borderColor: colors.surface_overlay,
                }}
              />
            ) : null}
          </View>
          <ChevronDown
            size={16}
            color={colors.secondary}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>

        <View className="ml-4">
          <ResponsiveUi.Text fontSize={18} tailwind="mb-2">
            {selectedAsset?.name ?? "Select Asset"}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text color={colors.secondary} light fontSize={18} bold>
            {privyBalanceLabel ?? "--"}
          </ResponsiveUi.Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={onUseMaxPress}>
        <ResponsiveUi.Text medium fontSize={16} tailwind="ml-4">
          Use Max
        </ResponsiveUi.Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalletBalance;
