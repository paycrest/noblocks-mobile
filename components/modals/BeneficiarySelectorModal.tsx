import { ResponsiveUi } from "@/components/ResponsiveUi";
import type { SavedBeneficiary } from "@/lib/beneficiaries/storage";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { Search, X } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import UserCircleIcon from "../svgs/user-circle-icon";

import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";

const MODAL_HEIGHT = Dimensions.get("screen").height * 0.5;

export type BeneficiaryItem = SavedBeneficiary;

interface BeneficiarySelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (beneficiary: BeneficiaryItem) => void;
  beneficiaries: BeneficiaryItem[];
  isLoading?: boolean;
}

const BeneficiarySelectorModal: FunctionComponent<
  BeneficiarySelectorModalProps
> = ({ isVisible, onClose, onSelect, beneficiaries, isLoading = false }) => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBeneficiaries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return beneficiaries;
    }

    return beneficiaries.filter((beneficiary) => {
      return (
        beneficiary.name.toLowerCase().includes(normalizedQuery) ||
        beneficiary.accountNumber.toLowerCase().includes(normalizedQuery) ||
        beneficiary.bankName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [beneficiaries, searchQuery]);

  const renderItem = ({ item }: { item: BeneficiaryItem }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: wp(2),
          paddingVertical: hp(1.2),
        }}
        onPress={() => {
          onSelect(item);
          onClose();
          setSearchQuery("");
        }}
      >
        <UserCircleIcon
          color={colors.subtle_surface}
          stroke={colors.secondary}
          height={hp(4)}
          width={hp(4)}
        />
        <View style={{ marginLeft: wp(3), flex: 1 }}>
          <ResponsiveUi.Text semiBold fontSize={hp(2.2)} color={colors.text}>
            {item.name}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={hp(1.9)} color={colors.secondary}>
            {item.accountNumber} • {item.bankName}
          </ResponsiveUi.Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <>
        <BackdropBlur onClose={onClose} />
        <View className="flex-1 items-center justify-center px-2">
          <View
            style={{
              width: "100%",
              height: MODAL_HEIGHT,
              borderRadius: 36,
              backgroundColor: colors.surface_overlay,
              borderWidth: 1,
              borderColor: colors.gray_hover,
              paddingHorizontal: 18,
              paddingTop: 22,
              paddingBottom: 14,
              marginTop: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: hp(2.2),
              }}
            >
              <ResponsiveUi.Text
                semiBold
                fontSize={hp(2.5)}
                color={colors.text}
              >
                Select beneficiary
              </ResponsiveUi.Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
                <X size={hp(3.5)} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                position: "relative",
                marginBottom: hp(1.5),
                justifyContent: "center",
              }}
            >
              <View style={{ position: "absolute", left: wp(4), zIndex: 10 }}>
                <Search size={hp(3.2)} color={colors.secondary} />
              </View>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search beneficiary"
                placeholderTextColor={colors.secondary}
                style={{
                  borderColor: colors.gray,
                  borderWidth: 1,
                  borderRadius: 18,
                  color: colors.text,
                  backgroundColor: colors.background,
                  paddingLeft: wp(14),
                  paddingRight: wp(4),
                  paddingVertical: hp(1.5),
                  fontSize: hp(2),
                  fontWeight: "500",
                }}
              />
            </View>

            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              <FlatList
                data={filteredBeneficiaries}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: hp(3), flexGrow: 1 }}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: hp(3),
                    }}
                  >
                    <ResponsiveUi.Text
                      color={colors.secondary}
                      fontSize={hp(1.7)}
                      center
                    >
                      {searchQuery.trim()
                        ? "No beneficiary matches your search."
                        : "No saved beneficiaries yet."}
                    </ResponsiveUi.Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default BeneficiarySelectorModal;
