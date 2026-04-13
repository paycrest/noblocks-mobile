import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { truncate } from "lodash";
import { ChevronDown, Plus } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface CurrencySelectorProps {
  selectedAsset?: {
    symbol: string;
    name: string;
    logoURI?: string;
  } | null;
  onPress?: () => void;
  chainLogoURI?: string;
}

const CurrencySelector: FunctionComponent<CurrencySelectorProps> = ({
  selectedAsset,
  onPress,
  chainLogoURI,
}) => {
  const colors = useThemeColors();
  return (
    <View className="mt-8 flex-1 flex-row justify-between    items-center">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center"
        onPress={onPress}
      >
        <View style={{ width: 32, height: 32 }}>
          {selectedAsset?.logoURI ? (
            <Image
              source={{ uri: selectedAsset.logoURI }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          ) : (
            <View
              style={{ backgroundColor: colors.secondary }}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <Plus size={18} color={colors.secondary} />
            </View>
          )}
          {chainLogoURI ? (
            <Image
              source={{ uri: chainLogoURI }}
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
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
          size={18}
          color={colors.secondary}
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      <View className="ml-8 w-1/3">
        <ResponsiveUi.Text medium fontSize={16}>
          Receive
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          medium
          fontSize={14}
          tailwind="mt-2"
          color={colors.secondary}
        >
          {truncate(selectedAsset?.name ?? "Select Currency", { length: 15 })}
        </ResponsiveUi.Text>
      </View>
      <View className="ml-auto w-1/3 flex items-end ">
        <ResponsiveUi.Text medium fontSize={18}>
          {truncate(selectedAsset?.symbol ?? "Select", { length: 15 })}
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

export default CurrencySelector;
