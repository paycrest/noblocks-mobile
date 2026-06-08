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
      style={{
        width: "100%",
        backgroundColor: colors.neutral_surface,
        borderWidth: 0.5,
        borderColor: colors.subtle_surface,
        borderRadius: 24,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: colors.subtle_surface,
              backgroundColor: colors.neutral_surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserSquareIcon width={20} height={20} />
          </View>

          <View style={{ marginLeft: 10, flex: 1 }}>
            <ResponsiveUi.Text medium fontSize={16} color={colors.text}>
              Select beneficiary
            </ResponsiveUi.Text>
            <ResponsiveUi.Text
              fontSize={14}
              color={colors.secondary}
              style={{ marginTop: 2 }}
            >
              From saved recipients
            </ResponsiveUi.Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.gray_hover,
            borderRadius: 360,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginLeft: 12,
          }}
        >
          <ResponsiveUi.Text medium fontSize={16} color={colors.text}>
            Select
          </ResponsiveUi.Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AddBeneficiaryCard;
