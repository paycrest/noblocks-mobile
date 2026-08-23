import React, { FunctionComponent } from "react";

import { useThemeColors } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface Props {
  screenTitle: string;
}

const ScreenHeader: FunctionComponent<Props> = ({ screenTitle }) => {
  const color = useThemeColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        minHeight: 44,
      }}
    >
      <ChevronLeft onPress={() => router.back()} color={color.text} size={24} />
      <ResponsiveUi.Text semiBold style={{ fontSize: 18, lineHeight: 24 }}>
        {screenTitle}
      </ResponsiveUi.Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default ScreenHeader;
