import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { truncate } from "lodash";
import { ChevronDown, Plus } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface CurrencySelectorProps {
  selectedAsset?: {
    symbol: string;
    name: string;
    logoURI?: string;
  } | null;
  label?: string;
  subtitle?: string;
  rightValue?: string;
  isLoading?: boolean;
  onPress?: () => void;
  chainLogoURI?: string;
}

const CurrencySelector: FunctionComponent<CurrencySelectorProps> = ({
  selectedAsset,
  label,
  subtitle,
  rightValue,
  isLoading = false,
  onPress,
  chainLogoURI,
}) => {
  const colors = useThemeColors();
  const parsedRightValue = (rightValue ?? "").replace(/[^\d.,-]/g, "").trim();
  const displayRightValue = parsedRightValue || "0";

  return (
    <View className="mt-8 flex-1 flex-row justify-between items-center">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center"
        onPress={onPress}
      >
        <View style={{ width: 40, height: 40 }}>
          {selectedAsset?.logoURI ? (
            <Image
              source={{ uri: selectedAsset.logoURI }}
              contentFit="fill"
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
              contentFit="contain"
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

      <View className="ml-4 ">
        <ResponsiveUi.Text medium fontSize={16}>
          {label ?? "Receive"}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          medium
          fontSize={14}
          tailwind="mt-2"
          color={colors.secondary}
        >
          {truncate(subtitle ?? selectedAsset?.name ?? "Select Currency", {
            length: 15,
          })}
        </ResponsiveUi.Text>
      </View>
      <View className="ml-auto w-1/3 flex items-end ">
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <ResponsiveUi.Text medium fontSize={18}>
            {truncate(displayRightValue, {
              length: 15,
            })}
          </ResponsiveUi.Text>
        )}
      </View>
    </View>
  );
};

export default CurrencySelector;
