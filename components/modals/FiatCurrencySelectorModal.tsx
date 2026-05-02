import { useThemeColors } from "@/hooks/useThemeColor";
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

import { ResponsiveUi } from "../ResponsiveUi";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";
import { useAppDimensions } from "@/hooks/useAppDimensions";

const MODAL_HEIGHT = Dimensions.get("screen").height * 0.46;
const ACTIVE_FIAT_CODES = new Set(["KES", "NGN"]);

export interface FiatCurrencyOption {
  code: string;
  name: string;
  shortName: string;
  decimals: number;
  symbol: string;
  marketBuyRate: string;
  marketSellRate: string;
  /** Locally resolved flag image URI — not part of the API response */
  logoURI?: string;
}

interface FiatCurrencySelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
  currencies: FiatCurrencyOption[];
  selectedCode?: string;
  onSelect: (currency: FiatCurrencyOption) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const FiatCurrencySelectorModal: FunctionComponent<
  FiatCurrencySelectorModalProps
> = ({
  isVisible,
  onClose,
  currencies,
  selectedCode,
  onSelect,
  isLoading = false,
  error = null,
  onRetry,
}) => {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");
  const { hp, wp } = useAppDimensions();

  const filteredCurrencies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return currencies;
    }

    return currencies.filter((currency) => {
      return (
        currency.name.toLowerCase().includes(normalizedQuery) ||
        currency.code.toLowerCase().includes(normalizedQuery) ||
        currency.shortName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [currencies, searchQuery]);

  const renderItem = ({ item }: { item: FiatCurrencyOption }) => {
    const isSelected = item.code === selectedCode;
    const isActive = ACTIVE_FIAT_CODES.has(item.code.toUpperCase());

    return (
      <TouchableOpacity
        activeOpacity={isActive ? 0.85 : 1}
        className="flex-row items-center px-2 py-3"
        disabled={!isActive}
        style={{ opacity: isActive ? 1 : 0.45 }}
        onPress={() => {
          if (!isActive) {
            return;
          }

          onSelect(item);
          onClose();
        }}
      >
        {item.logoURI ? (
          <Image
            source={{ uri: item.logoURI }}
            style={{ width: hp(5), height: hp(5), borderRadius: hp(3.5) }}
          />
        ) : (
          <View
            style={{
              width: wp(7),
              height: hp(7),
              borderRadius: hp(3.5),
              backgroundColor: colors.secondary,
            }}
            className="items-center justify-center"
          >
            <ResponsiveUi.Text medium fontSize={13}>
              {item.shortName.slice(0, 3)}
            </ResponsiveUi.Text>
          </View>
        )}

        <View className="ml-4 flex-1">
          <ResponsiveUi.Text medium fontSize={hp(2.2)}>
            {item.name}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={hp(2.2)} color={colors.secondary}>
            {item.shortName}
          </ResponsiveUi.Text>
        </View>

        {isSelected ? (
          <CheckCircle2 size={hp(2.5)} color={colors.primary} />
        ) : !isActive ? (
          <ResponsiveUi.Text fontSize={hp(2)} color={colors.secondary}>
            Unavailable
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
              borderRadius: 36,
              backgroundColor: colors.surface_overlay,
              borderWidth: 0.5,
              borderColor: colors.secondary,
              paddingHorizontal: 18,
              paddingTop: 22,
              paddingBottom: 14,
            }}
          >
            <View className="flex-row items-center justify-between mb-5">
              <ResponsiveUi.Text semiBold fontSize={hp(2.5)}>
                Select currency
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
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search currency"
                placeholderTextColor={colors.secondary}
                style={{
                  borderColor: colors.secondary,
                  borderWidth: 1,
                  borderRadius: 12,
                  color: colors.text,
                  backgroundColor: colors.background,
                  paddingLeft: 56,
                  paddingRight: 16,
                  paddingVertical: 14,
                  fontSize: hp(2.2),
                  fontWeight: "500",
                }}
              />
            </View>

            <View className="flex-1">
              {isLoading ? (
                <View className="flex-1 items-center justify-center py-8">
                  <ActivityIndicator color={colors.primary} />
                  <ResponsiveUi.Text
                    fontSize={hp(2.2)}
                    color={colors.secondary}
                    tailwind="mt-3"
                  >
                    Loading currencies...
                  </ResponsiveUi.Text>
                </View>
              ) : error ? (
                <View className="flex-1 items-center justify-center px-6">
                  <ResponsiveUi.Text
                    center
                    fontSize={hp(2.2)}
                    color={colors.secondary}
                    tailwind="mb-4"
                  >
                    {error}
                  </ResponsiveUi.Text>
                  {onRetry ? (
                    <TouchableOpacity activeOpacity={0.8} onPress={onRetry}>
                      <ResponsiveUi.Text
                        medium
                        fontSize={hp(2.2)}
                        color={colors.primary}
                      >
                        Try again
                      </ResponsiveUi.Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : (
                <FlatList
                  data={filteredCurrencies}
                  keyExtractor={(item) => item.code}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
                  ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-8">
                      <ResponsiveUi.Text
                        color={colors.secondary}
                        fontSize={hp(2.2)}
                      >
                        No currency matches your search.
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

export default FiatCurrencySelectorModal;
