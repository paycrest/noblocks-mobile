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
    <View className={`flex-row items-center justify-between`}>
      <ChevronLeft onPress={() => router.back()} color={color.text} />
      <ResponsiveUi.Text semiBold>{screenTitle}</ResponsiveUi.Text>
      <View />
    </View>
  );
};

export default ScreenHeader;
