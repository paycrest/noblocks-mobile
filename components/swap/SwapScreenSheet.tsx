import React, { FunctionComponent, ReactNode } from "react";
import { View, ViewStyle } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";

interface SwapScreenSheetProps {
  children: ReactNode;
  header?: ReactNode;
  style?: ViewStyle;
}

const SHEET_RADIUS = 40;

const SwapScreenSheet: FunctionComponent<SwapScreenSheetProps> = ({
  children,
  header,
  style,
}) => {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.surface_canvas,
          borderTopLeftRadius: SHEET_RADIUS,
          borderTopRightRadius: SHEET_RADIUS,
          borderWidth: 0.5,
          borderBottomWidth: 0,
          borderColor: colors.subtle_surface,
          paddingTop: 20,
          paddingHorizontal: 20,
        },
        style,
      ]}
    >
      {header}
      {children}
    </View>
  );
};

export default SwapScreenSheet;
