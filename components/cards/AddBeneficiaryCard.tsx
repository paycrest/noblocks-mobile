import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useAppDimensions } from "@/hooks/useAppDimensions";
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
  const { hp, wp, isSmallScreen, isLargeScreen } = useAppDimensions();

  const cardHorizontalPadding = isSmallScreen ? wp(3.5) : wp(4);
  const cardVerticalPadding = isSmallScreen ? hp(1.5) : hp(1.8);
  const iconContainerSize = isSmallScreen ? wp(11) : wp(10);
  const iconSize = isSmallScreen ? wp(4.7) : wp(4.2);
  const titleFontSize = isSmallScreen ? hp(1.9) : hp(2);
  const subtitleFontSize = isSmallScreen ? hp(1.6) : hp(1.75);
  const actionLabelFontSize = isSmallScreen ? hp(1.8) : hp(1.95);
  const actionHorizontalPadding = isSmallScreen ? wp(4) : wp(5);
  const actionVerticalPadding = isSmallScreen ? hp(0.9) : hp(1.1);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="w-full mt-2 rounded-3xl flex-row items-center justify-between"
      style={{
        backgroundColor: colors.subtle_surface,
        borderWidth: 0.5,
        borderColor: colors.gray,
        paddingHorizontal: cardHorizontalPadding,
        paddingVertical: cardVerticalPadding,
        width: isLargeScreen ? "85%" : "100%",
        alignSelf: "center",
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="rounded-full items-center justify-center"
          style={{
            borderWidth: 1,
            borderColor: colors.gray,
            width: iconContainerSize,
            height: iconContainerSize,
          }}
        >
          <UserSquareIcon width={iconSize} height={iconSize} />
        </View>

        <View className="flex-1" style={{ marginLeft: wp(3) }}>
          <ResponsiveUi.Text
            fontSize={titleFontSize}
            tailwind="mb-1"
            semiBold
            color={colors.text}
            numberOfLines={1}
          >
            Select beneficiary
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            fontSize={subtitleFontSize}
            color={colors.secondary}
            numberOfLines={1}
          >
            From saved recipients
          </ResponsiveUi.Text>
        </View>
      </View>

      <View
        className="ml-4 rounded-full"
        style={{
          backgroundColor: colors.gray_hover,
          paddingHorizontal: actionHorizontalPadding,
          paddingVertical: actionVerticalPadding,
        }}
      >
        <ResponsiveUi.Text
          fontSize={actionLabelFontSize}
          medium
          color={colors.text}
        >
          Select
        </ResponsiveUi.Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddBeneficiaryCard;
