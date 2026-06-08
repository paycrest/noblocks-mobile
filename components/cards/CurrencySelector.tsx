import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import truncate from "lodash/truncate";
import { Plus } from "lucide-react-native";
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
}) => {
  const colors = useThemeColors();
  const parsedRightValue = (rightValue ?? "").replace(/[^\d.,-]/g, "").trim();
  const displayRightValue = parsedRightValue || "0";
  const hasSelectedAsset = Boolean(selectedAsset);
  const valueLabel = hasSelectedAsset
    ? truncate(displayRightValue, { length: 15 })
    : "Select";

  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: colors.subtle_surface,
        backgroundColor: colors.neutral_surface,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 24,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={{ width: 44, height: 44 }}>
          {selectedAsset?.logoURI ? (
            <Image
              source={{ uri: selectedAsset.logoURI }}
              contentFit="fill"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
              }}
            />
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderColor: colors.subtle_surface,
                backgroundColor: colors.neutral_surface,
                borderStyle: "dashed",
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={20} color={colors.text} />
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
                borderColor: colors.neutral_surface,
              }}
            />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <ResponsiveUi.Text medium fontSize={16}>
            {label ?? "Receive"}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            fontSize={14}
            style={{ marginTop: 2 }}
            color={colors.secondary}
          >
            {truncate(subtitle ?? selectedAsset?.name ?? "Select currency", {
              length: 24,
            })}
          </ResponsiveUi.Text>
        </View>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : !hasSelectedAsset ? (
        <Pressable
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 360,
            backgroundColor: colors.gray_hover,
          }}
          onPress={onPress}
        >
          <ResponsiveUi.Text medium fontSize={16}>
            Select
          </ResponsiveUi.Text>
        </Pressable>
      ) : (
        <ResponsiveUi.Text medium fontSize={16}>
          {valueLabel}
        </ResponsiveUi.Text>
      )}
    </View>
  );
};

export default CurrencySelector;
