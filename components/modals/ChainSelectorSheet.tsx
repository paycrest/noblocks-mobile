import { useThemeColors } from "@/hooks/useThemeColor";
import { isPrivySupportedChain } from "@/utils/privy";
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
const FEATURED_CHAIN_ORDER = [
  "Base",
  "Ethereum",
  "Arbitrum",
  "Optimism",
  "Polygon",
];
const MODAL_HEIGHT = Math.min(420, Dimensions.get("screen").height * 0.46);

export interface LifiChain {
  id: number;
  key: string;
  name: string;
  coin: string;
  logoURI?: string;
  mainnet: boolean;
  chainType: string;
}

interface LifiChainsResponse {
  chains: LifiChain[];
}

interface ChainSelectorSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (chain: LifiChain) => void;
  selectedChainId?: number;
  includeTestnets?: boolean;
}

const ChainSelectorSheet: FunctionComponent<ChainSelectorSheetProps> = ({
  isVisible,
  onClose,
  onSelect,
  selectedChainId,
  includeTestnets = false,
}) => {
  const colors = useThemeColors();
  const [chains, setChains] = useState<LifiChain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const abortController = new AbortController();

    const fetchChains = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`${LIFI_API_BASE_URL}/chains`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chains (${response.status})`);
        }

        const data = (await response.json()) as LifiChainsResponse;
        const nextChains = (data.chains ?? [])
          .filter(
            (chain) =>
              chain.mainnet === !includeTestnets &&
              chain.chainType === "EVM" &&
              isPrivySupportedChain(chain.key),
          )
          .sort((left, right) => {
            const leftFeaturedIndex = FEATURED_CHAIN_ORDER.indexOf(left.name);
            const rightFeaturedIndex = FEATURED_CHAIN_ORDER.indexOf(right.name);

            if (leftFeaturedIndex !== -1 || rightFeaturedIndex !== -1) {
              if (leftFeaturedIndex === -1) return 1;
              if (rightFeaturedIndex === -1) return -1;
              return leftFeaturedIndex - rightFeaturedIndex;
            }

            return left.name.localeCompare(right.name);
          });

        setChains(nextChains);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setErrorMessage("Could not load chains right now.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchChains();

    return () => {
      abortController.abort();
    };
  }, [includeTestnets, isVisible]);

  const filteredChains = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return chains;
    }

    return chains.filter((chain) => {
      return (
        chain.name.toLowerCase().includes(normalizedQuery) ||
        chain.coin.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [chains, searchQuery]);

  const renderItem = ({ item }: { item: LifiChain }) => {
    const isSelected = selectedChainId === item.id;

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
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
        ) : (
          <View
            style={{ backgroundColor: colors.secondary }}
            className="w-9 h-9 rounded-full items-center justify-center"
          >
            <ResponsiveUi.Text medium fontSize={12}>
              {item.coin.slice(0, 3)}
            </ResponsiveUi.Text>
          </View>
        )}

        <View className="ml-3 flex-1">
          <ResponsiveUi.Text medium fontSize={16}>
            {item.name}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={13} color={colors.secondary}>
            {item.coin}
          </ResponsiveUi.Text>
        </View>

        {isSelected ? (
          <ResponsiveUi.Text fontSize={13} color={colors.primary} medium>
            Selected
          </ResponsiveUi.Text>
        ) : null}
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
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <ResponsiveUi.Text semiBold fontSize={18}>
                {includeTestnets ? "Select testnet" : "Select chain"}
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
                placeholder="Search chain"
                placeholderTextColor={colors.secondary}
                style={{
                  borderColor: colors.secondary,
                  borderWidth: 1,
                  borderRadius: 8,
                  color: colors.text,
                  backgroundColor: colors.background,
                  paddingLeft: 44,
                  paddingRight: 16,
                  paddingVertical: 14,
                }}
                value={searchQuery}
              />
            </View>

            <View className="flex-1">
              {isLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator color={colors.primary} />
                  <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
                    Loading chains...
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
                  data={filteredChains}
                  keyExtractor={(item) => String(item.id)}
                  keyboardShouldPersistTaps="handled"
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default ChainSelectorSheet;
