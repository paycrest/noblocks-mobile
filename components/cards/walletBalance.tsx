import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import _ from "lodash";

interface WalletBalanceProps {
  selectedAsset?: {
    symbol: string;
    name: string;
    logoURI?: string;
  } | null;
  privyBalanceLabel?: string;
  onAssetPress?: () => void;
  onUseMaxPress?: () => void;
  isUseMaxDisabled?: boolean;
  chainLogoURI?: string;
}

const WalletBalance: FunctionComponent<WalletBalanceProps> = ({
  selectedAsset,
  privyBalanceLabel,
  onAssetPress,
  onUseMaxPress,
  isUseMaxDisabled = false,
  chainLogoURI,
}) => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAssetPress}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <View style={{ width: 44, height: 44 }}>
            {selectedAsset?.logoURI ? (
              <Image
                source={{ uri: selectedAsset.logoURI }}
                style={{ width: 44, height: 44, borderRadius: 22 }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: colors.neutral_surface,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedAsset ? (
                  <ResponsiveUi.Text medium fontSize={14}>
                    {selectedAsset.symbol.slice(0, 3)}
                  </ResponsiveUi.Text>
                ) : (
                  <Plus size={18} color={colors.text} />
                )}
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
                  borderColor: colors.neutral_surface,
                }}
              />
            ) : null}
          </View>
        </TouchableOpacity>

        <View style={{ marginLeft: 12, flex: 1 }}>
          <ResponsiveUi.Text medium fontSize={16} numberOfLines={1}>
            {_.truncate(selectedAsset?.name, { length: 20 }) ?? "Select Asset"}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            color={colors.secondary}
            fontSize={14}
            style={{ marginTop: 2 }}
          >
            {privyBalanceLabel ?? "--"}
          </ResponsiveUi.Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isUseMaxDisabled}
        onPress={onUseMaxPress}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 360,
          backgroundColor: colors.gray_hover,
          opacity: isUseMaxDisabled ? 0.4 : 1,
        }}
      >
        <ResponsiveUi.Text medium fontSize={16}>
          Use max
        </ResponsiveUi.Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalletBalance;
