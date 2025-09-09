import React, { FunctionComponent, ReactElement } from "react";
import { Pressable, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";
import { globalStyles } from "@/utils/styles";
import { ChevronRight } from "lucide-react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface Props {
  onPress: () => void;
  title: string;
  icon: ReactElement;
}

const SettingsLinks: FunctionComponent<Props> = ({ onPress, title, icon }) => {
  const colors = useThemeColors();
  return (
    <Pressable onPress={onPress} style={globalStyles.centeredBetween}>
      {/* Left side: icon + text */}
      <View className="flex-row items-center">
        {icon}
        <ResponsiveUi.Text small style={{ marginLeft: 10 }}>
          {title}
        </ResponsiveUi.Text>
      </View>

      {/* Right side: Chevron */}
      <ChevronRight color={colors.secondary} />
    </Pressable>
  );
};

export default SettingsLinks;
