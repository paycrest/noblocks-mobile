import React, { FunctionComponent, ReactElement } from "react";
import { Pressable, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";
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
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 32, height: 32 }}>{icon}</View>
        <ResponsiveUi.Text medium style={{ fontSize: 16, lineHeight: 24 }}>
          {title}
        </ResponsiveUi.Text>
      </View>
      <ChevronRight color={colors.secondary} size={16} />
    </Pressable>
  );
};

export default SettingsLinks;
