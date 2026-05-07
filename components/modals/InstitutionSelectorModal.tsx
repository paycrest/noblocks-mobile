import { QUERY_STALE_TIME_MS } from "@/api/queryConstants";
import {
  fetchPaycrestInstitutions,
  type PaycrestInstitution,
} from "@/api/queryFns";
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

import { ResponsiveUi } from "../ResponsiveUi";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";

const MODAL_HEIGHT = Dimensions.get("screen").height * 0.46;
export type { PaycrestInstitution };

interface InstitutionSelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
  currencyCode: string;
  selectedCode?: string;
  onSelect: (institution: PaycrestInstitution) => void;
}

const InstitutionSelectorModal: FunctionComponent<
  InstitutionSelectorModalProps
> = ({ isVisible, onClose, currencyCode, selectedCode, onSelect }) => {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: institutions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paycrest", "institutions", currencyCode.toUpperCase()],
    enabled: isVisible && Boolean(currencyCode),
    queryFn: () => fetchPaycrestInstitutions(currencyCode),
    staleTime: QUERY_STALE_TIME_MS,
    retry: false,
  });

  const errorMessage = error
    ? "Unable to load institutions right now. Please try again."
    : null;

  const filteredInstitutions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return institutions;
    }

    return institutions.filter((institution) => {
      return (
        institution.name.toLowerCase().includes(normalizedQuery) ||
        institution.code.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [institutions, searchQuery]);

  const renderItem = ({ item }: { item: PaycrestInstitution }) => {
    const isSelected = item.code === selectedCode;
    const firstCharacter = item.name.trim().charAt(0).toUpperCase();

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        className="flex-row items-center px-2 py-3"
        onPress={() => {
          onSelect(item);
          onClose();
          setSearchQuery("");
        }}
      >
        {item.logoURI ? (
          <Image
            source={{ uri: item.logoURI }}
            style={{ width: 26, height: 26, borderRadius: 13, marginRight: 10 }}
            contentFit="cover"
          />
        ) : (
          <View
            className="items-center justify-center mr-3"
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              borderWidth: 1,
              borderColor: colors.gray,
              backgroundColor: colors.background,
            }}
          >
            <ResponsiveUi.Text fontSize={11} semiBold color={colors.secondary}>
              {firstCharacter || "B"}
            </ResponsiveUi.Text>
          </View>
        )}
        <View className="flex-1">
          <ResponsiveUi.Text medium fontSize={17}>
            {item.name}
          </ResponsiveUi.Text>
        </View>

        {isSelected ? <CheckCircle2 size={20} color={colors.primary} /> : null}
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
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: colors.secondary,
              paddingHorizontal: 18,
              paddingTop: 22,
              paddingBottom: 14,
            }}
          >
            <View className="flex-row items-center justify-between mb-5">
              <ResponsiveUi.Text semiBold fontSize={20}>
                Select bank
              </ResponsiveUi.Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
                <X size={28} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <View className="relative mb-4 justify-center">
              <View className="absolute left-4 z-10">
                <Search size={24} color={colors.secondary} />
              </View>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search institution"
                placeholderTextColor={colors.secondary}
                style={{
                  borderColor: colors.secondary,
                  //   borderWidth: 1,
                  borderRadius: 12,
                  color: colors.text,
                  backgroundColor: colors.background,
                  paddingLeft: 56,
                  paddingRight: 16,
                  paddingVertical: 14,
                  fontSize: 17,
                  fontWeight: "500",
                }}
              />
            </View>

            <View className="flex-1 relative">
              <FlatList
                data={filteredInstitutions}
                keyExtractor={(item) => item.code}
                renderItem={renderItem}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
                ListEmptyComponent={
                  !isLoading && !errorMessage ? (
                    <View className="items-center py-8">
                      <ResponsiveUi.Text color={colors.secondary} fontSize={14}>
                        No institutions match your search.
                      </ResponsiveUi.Text>
                    </View>
                  ) : null
                }
              />

              {isLoading ? (
                <View className="absolute top-0 right-0 bottom-0 left-0 items-center justify-center">
                  <ActivityIndicator color={colors.primary} size="small" />
                  <ResponsiveUi.Text
                    fontSize={14}
                    color={colors.secondary}
                    tailwind="mt-3"
                  >
                    Loading institutions...
                  </ResponsiveUi.Text>
                </View>
              ) : null}

              {!isLoading && errorMessage ? (
                <View className="absolute top-0 right-0 bottom-0 left-0 items-center justify-center px-6">
                  <ResponsiveUi.Text
                    center
                    fontSize={14}
                    color={colors.secondary}
                    tailwind="mb-4"
                  >
                    {errorMessage}
                  </ResponsiveUi.Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      void refetch();
                    }}
                  >
                    <ResponsiveUi.Text
                      medium
                      fontSize={14}
                      color={colors.primary}
                    >
                      Try again
                    </ResponsiveUi.Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default InstitutionSelectorModal;
