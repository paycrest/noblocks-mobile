import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import truncate from "lodash/truncate";

interface SwapChainRowProps {
  title?: string;
  chainName?: string;
  chainLogoUri?: string | null;
  onPress?: () => void;
  isStatic?: boolean;
  showChevron?: boolean;
  marginTop?: number;
  disableChevron?: boolean;
}

const SwapChainRow: FunctionComponent<SwapChainRowProps> = ({
  title = "Swap",
  chainName,
  chainLogoUri,
  onPress,
  isStatic = false,
  showChevron = true,
  marginTop = 0,
  disableChevron = false,
}) => {
  const colors = useThemeColors();
  const { wp } = useAppDimensions();

  const chainLogoSize = wp(isStatic ? 6 : 5);
  const chainLogoRadius = chainLogoSize / 2;
  const chainLogoMargin = wp(1);
  const titleFontSize = 20;
  const chainFontSize = 14;
  const chevronSize = wp(4.5);

  const chainPillStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: colors.neutral_surface,
    borderWidth: 0.5,
    borderColor: colors.subtle_surface,
    paddingHorizontal: 4,
    paddingRight: 8,
    paddingVertical: 4,
    borderRadius: 360,
  };

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
      <ResponsiveUi.Text medium fontSize={chainFontSize}>
        {truncate(chainName, { length: 15 })}
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
        marginTop,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <ResponsiveUi.Text semiBold fontSize={titleFontSize}>
        {title}
      </ResponsiveUi.Text>
      {isStatic ? (
        <View style={chainPillStyle}>{content}</View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={chainPillStyle}
          disabled={disableChevron}
        >
          {content}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SwapChainRow;
