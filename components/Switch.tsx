import React, { FunctionComponent, useState } from "react";
import { Switch, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";

interface Props {
  onToggle: (state: boolean) => void;
}

const AppSwitch: FunctionComponent<Props> = ({ onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    onToggle(!isEnabled);
    setIsEnabled((previousState) => !previousState);
  };
  const colors = useThemeColors();
  return (
    <View>
      <Switch
        trackColor={{ false: colors.secondary, true: colors.slate }}
        thumbColor={colors.white}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
        style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
      />
    </View>
  );
};

export default AppSwitch;
