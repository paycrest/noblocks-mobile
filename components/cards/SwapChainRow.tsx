import { ResponsiveUi } from "@/components/ResponsiveUi";
import { Colors } from "@/constants/Colors";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SwapChainRowProps {
  title?: string;
  chainName?: string;
  chainLogoUri?: string | null;
  onPress?: () => void;
  isStatic?: boolean;
  showChevron?: boolean;
  marginTop?: number;
}

const SwapChainRow: FunctionComponent<SwapChainRowProps> = ({
  title = "Swap",
  chainName,
  chainLogoUri,
  onPress,
  isStatic = false,
  showChevron = true,
  marginTop,
}) => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();

  const chainLogoSize = wp(isStatic ? 6 : 7);
  const chainLogoRadius = chainLogoSize / 2;
  const chainLogoMargin = wp(2);
  const titleFontSize = hp(isStatic ? 2.2 : 2.3);
  const chainFontSize = hp(isStatic ? 2.2 : 1.8);
  const chevronSize = wp(4.5);

  const content = (
    <>
      {chainLogoUri ? (
        <Image
          source={{ uri: chainLogoUri }}
          style={{
            width: chainLogoSize,
            height: chainLogoSize,
            borderRadius: chainLogoRadius,
            marginRight: chainLogoMargin,
          }}
        />
      ) : null}
      <ResponsiveUi.Text
        medium
        fontSize={chainFontSize}
        style={isStatic ? { marginLeft: chainLogoMargin } : undefined}
      >
        {chainName}
      </ResponsiveUi.Text>
      {!isStatic && showChevron ? (
        <ChevronDown
          color={colors.primary}
          size={chevronSize}
          style={{ marginLeft: chainLogoMargin }}
        />
      ) : null}
    </>
  );

  return (
    <View
      style={{
        marginTop: marginTop ?? hp(isStatic ? 4.5 : 3.5),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ResponsiveUi.Text
        semiBold
        fontSize={titleFontSize}
        style={isStatic ? { marginTop: hp(1) } : undefined}
      >
        {title}
      </ResponsiveUi.Text>
      {isStatic ? (
        <View style={styles.chainPillStyle}>{content}</View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={styles.chainPillStyle}
        >
          {content}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chainPillStyle: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.neutral_surface,
    borderWidth: 1,
    borderColor: Colors.subtle_surface,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default SwapChainRow;
