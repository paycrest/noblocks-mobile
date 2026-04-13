import { useThemeColors } from "@/hooks/useThemeColor";
import { isPrivySupportedAsset } from "@/utils/privy";
import { Image } from "expo-image";
import { Search, X } from "lucide-react-native";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
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

const LIFI_API_BASE_URL = "https://li.quest/v1";
const FEATURED_SYMBOL_ORDER = ["ETH", "USDC", "USDT", "DAI", "WBTC"];
const MODAL_HEIGHT = Math.min(420, Dimensions.get("screen").height * 0.4);

export interface LifiToken {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  priceUSD?: string;
  coinKey?: string;
}

interface LifiTokensResponse {
  tokens: Record<string, LifiToken[]>;
}

interface AssetSelectorSheetProps {
  chainId: number;
  isVisible: boolean;
  onClose: () => void;
  onSelect: (asset: LifiToken) => void;
  selectedAssetAddress?: string;
}

const AssetSelectorSheet: FunctionComponent<AssetSelectorSheetProps> = ({
  chainId,
  isVisible,
  onClose,
  onSelect,
  selectedAssetAddress,
}) => {
  const colors = useThemeColors();
  const [assets, setAssets] = useState<LifiToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const abortController = new AbortController();

    const fetchAssets = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `${LIFI_API_BASE_URL}/tokens?chains=${chainId}`,
          {
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch assets (${response.status})`);
        }

        const data = (await response.json()) as LifiTokensResponse;
        const nextAssets = (data.tokens?.[String(chainId)] ?? [])
          .filter(
            (asset) =>
              asset.symbol && asset.name && isPrivySupportedAsset(asset.symbol),
          )
          .sort((left, right) => {
            const leftFeaturedIndex = FEATURED_SYMBOL_ORDER.indexOf(
              left.symbol,
            );
            const rightFeaturedIndex = FEATURED_SYMBOL_ORDER.indexOf(
              right.symbol,
            );

            if (leftFeaturedIndex !== -1 || rightFeaturedIndex !== -1) {
              if (leftFeaturedIndex === -1) return 1;
              if (rightFeaturedIndex === -1) return -1;
              return leftFeaturedIndex - rightFeaturedIndex;
            }

            const leftPrice = Number(left.priceUSD ?? 0);
            const rightPrice = Number(right.priceUSD ?? 0);

            if (leftPrice !== rightPrice) {
              return rightPrice - leftPrice;
            }

            return left.symbol.localeCompare(right.symbol);
          })
          .slice(0, 80);

        setAssets(nextAssets);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setErrorMessage("Could not load assets right now.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchAssets();

    return () => {
      abortController.abort();
    };
  }, [chainId, isVisible]);

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
            <ResponsiveUi.Text fontSize={10} color={colors.primary} bold>
              Selected
            </ResponsiveUi.Text>
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
              borderRadius: 28,
              backgroundColor: colors.surface_overlay,
              paddingHorizontal: 16,
              paddingTop: 28,
              paddingBottom: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <ResponsiveUi.Text semiBold fontSize={18}>
                Select asset
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
