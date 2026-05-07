import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import truncate from "lodash/truncate";
import { ChevronDown, Plus } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import { ActivityIndicator } from "react-native-paper";
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
  compact?: boolean;
}

const CurrencySelector: FunctionComponent<CurrencySelectorProps> = ({
  selectedAsset,
  label,
  subtitle,
  rightValue,
  isLoading = false,
  onPress,
  chainLogoURI,
  compact = false,
}) => {
  const colors = useThemeColors();
  const parsedRightValue = (rightValue ?? "").replace(/[^\d.,-]/g, "").trim();
  const displayRightValue = parsedRightValue || "0";
  const hasSelectedAsset = Boolean(selectedAsset);
  const valueLabel = hasSelectedAsset
    ? truncate(displayRightValue, { length: 15 })
    : "Select";
  const rowMinHeight = compact ? 68 : 80;
  const horizontalPadding = compact ? 16 : 20;
  const verticalPadding = compact ? 10 : 16;
  const iconSize = compact ? 34 : 40;
  const iconRadius = iconSize / 2;
  const textSize = compact ? 14 : 16;
  const subtitleSize = compact ? 12 : 14;
  const valueSize = compact ? 16 : 18;
  const valueLines = compact ? 1 : 2;

  return (
    <View
      className="mt-4 border border-subtle_surface rounded-2xl bg-neutral_surface flex-row justify-between items-center"
      style={{
        minHeight: rowMinHeight,
        paddingHorizontal: horizontalPadding,
        paddingVertical: verticalPadding,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center"
        onPress={onPress}
      >
        <View style={{ width: iconSize, height: iconSize }}>
          {selectedAsset?.logoURI ? (
            <Image
              source={{ uri: selectedAsset.logoURI }}
              contentFit="fill"
              style={{
                width: iconSize,
                height: iconSize,
                borderRadius: iconRadius,
              }}
            />
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.gray,
                backgroundColor: colors.subtle_surface,
                borderStyle: "dashed",
                width: iconSize,
                height: iconSize,
                borderRadius: iconRadius,
              }}
              className="items-center justify-center"
            >
              <Plus size={18} color={colors.text} />
            </View>
          )}
          {chainLogoURI ? (
            <Image
              source={{ uri: chainLogoURI }}
              contentFit="contain"
              style={{
                width: compact ? 14 : 16,
                height: compact ? 14 : 16,
                borderRadius: compact ? 7 : 8,
                position: "absolute",
                top: 0,
                left: -2,
                borderWidth: 1.5,
                borderColor: colors.white,
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
        <ResponsiveUi.Text medium fontSize={textSize}>
          {label ?? "Receive"}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          medium
          fontSize={subtitleSize}
          tailwind={compact ? "mt-1" : "mt-2"}
          color={colors.secondary}
        >
          {truncate(subtitle ?? selectedAsset?.name ?? "Select Currency", {
            length: 15,
          })}
        </ResponsiveUi.Text>
      </View>
      <View
        className="ml-auto flex items-end"
        style={{ width: compact ? "42%" : "33%" }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : !hasSelectedAsset ? (
          <Pressable
            className="px-4 rounded-3xl"
            style={{
              height: 44,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.gray_hover,
            }}
            onPress={onPress}
          >
            <ResponsiveUi.Text
              numberOfLines={valueLines}
              medium
              fontSize={valueSize}
            >
              {valueLabel}
            </ResponsiveUi.Text>
          </Pressable>
        ) : (
          <ResponsiveUi.Text
            numberOfLines={valueLines}
            medium
            fontSize={valueSize}
          >
            {valueLabel}
          </ResponsiveUi.Text>
        )}
      </View>
    </View>
  );
};

export default CurrencySelector;
