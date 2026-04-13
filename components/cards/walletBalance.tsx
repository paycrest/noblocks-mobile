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
}

const WalletBalance: FunctionComponent<WalletBalanceProps> = ({
  selectedAsset,
  privyBalanceLabel,
  onAssetPress,
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
      <TouchableOpacity>
        <ResponsiveUi.Text medium fontSize={16} tailwind="ml-4">
          Use Max
        </ResponsiveUi.Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalletBalance;
