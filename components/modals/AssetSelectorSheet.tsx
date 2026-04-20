import { fetchLifiTokens, type LifiToken } from "@/api/queryFns";
import { useThemeColors } from "@/hooks/useThemeColor";
import { isPrivySupportedAsset } from "@/utils/privy";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { CheckCircle2, Search, X } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ResponsiveUi } from "../ResponsiveUi";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";

const FEATURED_SYMBOL_ORDER = ["ETH", "USDC", "USDT", "DAI", "WBTC"];
const MODAL_HEIGHT = Math.min(420, Dimensions.get("screen").height * 0.4);
export type { LifiToken };

interface AssetSelectorSheetProps {
  chainId: number;
  isVisible: boolean;
  onClose: () => void;
  onSelect: (asset: LifiToken) => void;
  selectedAssetAddress?: string;
  selectedChainName?: string;
  onChainPress?: () => void;
  chainLogoURI?: string;
}

const AssetSelectorSheet: FunctionComponent<AssetSelectorSheetProps> = ({
  chainId,
  isVisible,
  onClose,
  onSelect,
  selectedAssetAddress,
  selectedChainName,
  onChainPress,
  chainLogoURI,
}) => {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: assets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lifi", "tokens", chainId],
    enabled: isVisible,
    queryFn: () => fetchLifiTokens(chainId),
    staleTime: 5 * 60 * 1000,
  });

  const errorMessage = error instanceof Error ? error.message : null;

  const filteredAssets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return assets;
    }

    return assets.filter((asset) => {
      return (
        asset.symbol.toLowerCase().includes(normalizedQuery) ||
        asset.name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [assets, searchQuery]);

  const renderItem = ({ item }: { item: LifiToken }) => {
    const isSelected =
      selectedAssetAddress?.toLowerCase() === item.address.toLowerCase();
    const formattedPrice = item.priceUSD
      ? Number(item.priceUSD).toFixed(Number(item.priceUSD) >= 1 ? 2 : 4)
      : null;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center px-4 py-3"
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <View style={{ width: 40, height: 40 }}>
          {item.logoURI ? (
            <Image
              source={{ uri: item.logoURI }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <View
              style={{ backgroundColor: colors.secondary }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <ResponsiveUi.Text medium fontSize={13}>
                {item.symbol.slice(0, 3)}
              </ResponsiveUi.Text>
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
                bottom: 0,
                right: -2,
                borderWidth: 1.5,
                borderColor: colors.surface_overlay,
              }}
            />
          ) : null}
        </View>

        <View className="ml-3 flex-1">
          <ResponsiveUi.Text medium fontSize={16}>
            {item.symbol}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={13} color={colors.secondary}>
            {item.name}
          </ResponsiveUi.Text>
        </View>

        <View className="items-end">
          {formattedPrice ? (
            <ResponsiveUi.Text fontSize={13} color={colors.secondary}>
              ${formattedPrice}
            </ResponsiveUi.Text>
          ) : null}
          {isSelected ? (
            <CheckCircle2 size={18} color={colors.primary} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <>
        <BackdropBlur onClose={onClose} />
        <View className="flex-1 items-center justify-center px-4">
          <View
            style={{
              width: "100%",
              height: MODAL_HEIGHT,
              borderRadius: 30,
              backgroundColor: colors.surface_overlay,
              paddingHorizontal: 16,
              paddingTop: 28,
              paddingBottom: 12,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <ResponsiveUi.Text semiBold fontSize={18}>
                Select token
              </ResponsiveUi.Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
                <X size={20} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <View className="relative mb-4 justify-center">
              <View className="absolute left-4 z-10">
                <Search size={18} color={colors.secondary} />
              </View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setSearchQuery}
                placeholder="Search token"
                placeholderTextColor={colors.secondary}
                style={{
                  borderColor: colors.secondary,
                  borderWidth: 0.5,
                  borderRadius: 8,
                  color: colors.text,
                  backgroundColor: colors.background,
                  paddingLeft: 44,
                  paddingRight: 16,
                  paddingVertical: 14,
                  fontWeight: "500",
                  fontSize: 15,
                }}
                value={searchQuery}
              />
            </View>

            <View className="flex-1">
              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator color={colors.primary} />
                  <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
                    Loading assets...
                  </ResponsiveUi.Text>
                </View>
              ) : errorMessage ? (
                <View className="flex-1 items-center justify-center px-6">
                  <ResponsiveUi.Text
                    center
                    fontSize={14}
                    color={colors.secondary}
                  >
                    {errorMessage}
                  </ResponsiveUi.Text>
                </View>
              ) : (
                <FlatList
                  data={filteredAssets}
                  keyExtractor={(item) => `${item.chainId}:${item.address}`}
                  keyboardShouldPersistTaps="handled"
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  style={{ flex: 1 }}
                  ListEmptyComponent={
                    <View className="items-center justify-center py-10">
                      <ResponsiveUi.Text color={colors.secondary} fontSize={14}>
                        No assets match your search.
                      </ResponsiveUi.Text>
                    </View>
                  }
                />
              )}
            </View>
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default AssetSelectorSheet;
