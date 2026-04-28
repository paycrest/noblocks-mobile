import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Search, X } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useState } from "react";
import {
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

export interface BeneficiaryItem {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
}

const DUMMY_BENEFICIARIES: BeneficiaryItem[] = [
  {
    id: "1",
    name: "Oluwaseun Michael Adeyemi",
    accountNumber: "07392748293",
    bankName: "Zenith Bank",
  },
  {
    id: "2",
    name: "Blessed Enyeama Okedigba",
    accountNumber: "07392748293",
    bankName: "Premium Trust Bank",
  },
  {
    id: "3",
    name: "Amara Joy Nwosu",
    accountNumber: "09876543210",
    bankName: "Stanbic Bank",
  },
  {
    id: "4",
    name: "Nneka Ugochukwu",
    accountNumber: "07392748293",
    bankName: "Access Bank",
  },
  {
    id: "5",
    name: "Adaobi Chukwuemeka",
    accountNumber: "07392748293",
    bankName: "Bosni Bank",
  },
];

interface BeneficiarySelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (beneficiary: BeneficiaryItem) => void;
}

const BeneficiarySelectorModal: FunctionComponent<
  BeneficiarySelectorModalProps
> = ({ isVisible, onClose, onSelect }) => {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBeneficiaries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return DUMMY_BENEFICIARIES;
    }

    return DUMMY_BENEFICIARIES.filter((beneficiary) => {
      return (
        beneficiary.name.toLowerCase().includes(normalizedQuery) ||
        beneficiary.accountNumber.toLowerCase().includes(normalizedQuery) ||
        beneficiary.bankName.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  const renderItem = ({ item }: { item: BeneficiaryItem }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        className="flex-row items-center px-1 py-3"
        onPress={() => {
          onSelect(item);
          onClose();
          setSearchQuery("");
        }}
      >
        <UserCircleIcon
          color={colors.subtle_surface}
          stroke={colors.secondary}
        />
        <View className="ml-4 flex-1">
          <ResponsiveUi.Text semiBold fontSize={18} color={colors.text}>
            {item.name}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={16} color={colors.secondary}>
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
            <View className="flex-row items-center justify-between mb-5">
              <ResponsiveUi.Text semiBold fontSize={20} color={colors.text}>
                Select beneficiary
              </ResponsiveUi.Text>
              <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
                <X size={34} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            <View className="relative mb-4 justify-center">
              <View className="absolute left-4 z-10">
                <Search size={30} color={colors.secondary} />
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
                  paddingLeft: 60,
                  paddingRight: 16,
                  paddingVertical: 14,
                  fontSize: 17,
                  fontWeight: "500",
                }}
              />
            </View>

            <FlatList
              data={filteredBeneficiaries}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center py-8">
                  <ResponsiveUi.Text color={colors.secondary} fontSize={14}>
                    No beneficiary matches your search.
                  </ResponsiveUi.Text>
                </View>
              }
            />
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default BeneficiarySelectorModal;
