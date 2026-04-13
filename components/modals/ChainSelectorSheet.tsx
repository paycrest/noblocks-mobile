import { useThemeColors } from "@/hooks/useThemeColor";
import { isPrivySupportedChain } from "@/utils/privy";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ResponsiveUi } from "../ResponsiveUi";
import BaseSheet from "./BottomSheet";

const LIFI_API_BASE_URL = "https://li.quest/v1";
const FEATURED_CHAIN_ORDER = [
  "Base",
  "Ethereum",
  "Arbitrum",
  "Optimism",
  "Polygon",
];

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
}

const ChainSelectorSheet: FunctionComponent<ChainSelectorSheetProps> = ({
  isVisible,
  onClose,
  onSelect,
  selectedChainId,
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
              chain.mainnet &&
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
  }, [isVisible]);

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
    <BaseSheet
      isVisible={isVisible}
      onVisibilityChange={(visible) => {
        if (!visible) {
          onClose();
        }
      }}
      snapPoints={["75%"]}
    >
      <View className="flex-1 px-4 pt-2">
        <ResponsiveUi.Text semiBold fontSize={18} tailwind="mb-4">
          Select chain
        </ResponsiveUi.Text>

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
            paddingHorizontal: 16,
            paddingVertical: 14,
            marginBottom: 16,
          }}
          value={searchQuery}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.primary} />
            <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
              Loading chains...
            </ResponsiveUi.Text>
          </View>
        ) : errorMessage ? (
          <View className="flex-1 items-center justify-center px-6">
            <ResponsiveUi.Text center fontSize={14} color={colors.secondary}>
              {errorMessage}
            </ResponsiveUi.Text>
          </View>
        ) : (
          <BottomSheetFlatList
            data={filteredChains}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </BaseSheet>
  );
};

export default ChainSelectorSheet;
