import { QUERY_STALE_TIME_MS } from "@/api/queryConstants";
import { fetchLifiTokens, type LifiToken } from "@/api/queryFns";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { CheckCircle2, Search, X } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import truncate from "lodash/truncate";

import { ResponsiveUi } from "../ResponsiveUi";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";
import { useAppDimensions } from "@/hooks/useAppDimensions";

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
  const { hp, wp } = useAppDimensions();

  const {
    data: assets = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lifi", "tokens", chainId],
    enabled: isVisible,
    queryFn: () => fetchLifiTokens(chainId),
    staleTime: QUERY_STALE_TIME_MS,
    retry: false,
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
      ? Number(item.priceUSD).toFixed(3)
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
        <View style={{ width: hp(5), height: hp(5) }}>
          {item.logoURI ? (
            <Image
              source={{ uri: item.logoURI }}
              style={{ width: hp(4), height: hp(4), borderRadius: hp(2.5) }}
            />
          ) : (
            <View
              style={{ backgroundColor: colors.secondary }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <ResponsiveUi.Text medium fontSize={hp(1.3)}>
                {item.symbol.slice(0, 3)}
              </ResponsiveUi.Text>
            </View>
          )}
          {chainLogoURI ? (
            <Image
              source={{ uri: chainLogoURI }}
              style={{
                width: hp(2),
                height: hp(2),
                borderRadius: hp(1),
                position: "absolute",
                bottom: 5,
                right: 0,
                borderWidth: 1.5,
                borderColor: colors.neutral_surface,
              }}
            />
          ) : null}
        </View>

        <View className="ml-3 w-1/3 flex-1">
          <ResponsiveUi.Text medium fontSize={hp(2)}>
            {item.symbol}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={hp(1.8)} color={colors.secondary}>
            {truncate(item.name, { length: 10 })}
          </ResponsiveUi.Text>
        </View>

        <View className="items-end w-1/3 flex-row">
          {formattedPrice ? (
            <ResponsiveUi.Text fontSize={hp(1.8)} color={colors.secondary}>
              ${formattedPrice}
            </ResponsiveUi.Text>
          ) : null}
          {isSelected ? (
            <CheckCircle2
              size={hp(2.5)}
              className="ml-2"
              color={colors.primary}
            />
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
              backgroundColor: colors.background,
              paddingHorizontal: 16,
              paddingTop: 28,
              paddingBottom: 12,
              borderColor: colors.secondary,
              borderWidth: 0.5,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <ResponsiveUi.Text semiBold fontSize={hp(2.5)}>
                Select token
              </ResponsiveUi.Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
                <X size={hp(2.5)} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <View className="relative mb-4 justify-center">
              <View className="absolute left-4 z-10">
                <Search size={hp(2.5)} color={colors.secondary} />
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
                  fontSize: hp(1.8),
                }}
                value={searchQuery}
              />
            </View>

            <View className="flex-1">
              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator color={colors.primary} />
                  <ResponsiveUi.Text
                    fontSize={hp(1.8)}
                    color={colors.secondary}
                  >
                    Loading assets...
                  </ResponsiveUi.Text>
                </View>
              ) : errorMessage ? (
                <View className="flex-1 items-center justify-center px-6">
                  <ResponsiveUi.Text
                    center
                    fontSize={hp(1.8)}
                    color={colors.secondary}
                  >
                    {errorMessage}
                  </ResponsiveUi.Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    className="mt-4 px-4 py-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    onPress={() => {
                      void refetch();
                    }}
                  >
                    {isFetching ? (
                      <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                      <ResponsiveUi.Text
                        fontSize={hp(1.8)}
                        semiBold
                        color={colors.white}
                      >
                        Try again
                      </ResponsiveUi.Text>
                    )}
                  </TouchableOpacity>
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
                      <ResponsiveUi.Text
                        color={colors.secondary}
                        fontSize={hp(1.8)}
                      >
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
