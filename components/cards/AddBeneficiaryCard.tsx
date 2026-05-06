import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import UserSquareIcon from "../svgs/user-square-icon";

interface AddBeneficiaryCardProps {
  onPress: () => void;
}

const AddBeneficiaryCard: FunctionComponent<AddBeneficiaryCardProps> = ({
  onPress,
}) => {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="w-full mt-2 rounded-3xl px-4 py-4 flex-row items-center justify-between"
      style={{
        backgroundColor: colors.subtle_surface,
        borderWidth: 0.5,
        borderColor: colors.gray,
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-12 h-12  rounded-full items-center justify-center"
          style={{
            borderWidth: 1,
            borderColor: colors.gray,
          }}
        >
          <UserSquareIcon width={20} height={20} />
        </View>

        <View className="ml-4 flex-1">
          <ResponsiveUi.Text
            fontSize={16}
            tailwind="mb-1"
            semiBold
            color={colors.text}
          >
            Select beneficiary
          </ResponsiveUi.Text>
          <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
            From saved recipients
          </ResponsiveUi.Text>
        </View>
      </View>

      <View
        className="ml-4 rounded-full px-5 py-2"
        style={{ backgroundColor: colors.gray_hover }}
      >
        <ResponsiveUi.Text fontSize={16} medium color={colors.text}>
          Select
        </ResponsiveUi.Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddBeneficiaryCard;
