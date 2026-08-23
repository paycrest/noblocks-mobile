import React, { FunctionComponent, useState } from "react";
import { Switch, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";

interface Props {
  onToggle: (state: boolean) => void;
  value?: boolean;
}

const AppSwitch: FunctionComponent<Props> = ({ onToggle, value }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const enabled = value ?? isEnabled;

  const toggleSwitch = (nextValue: boolean) => {
    onToggle(nextValue);
    if (value == null) {
      setIsEnabled(nextValue);
    }
  };

  const colors = useThemeColors();
  return (
    <View>
      <Switch
        trackColor={{ false: colors.gray_hover, true: colors.slate }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.gray_hover}
        onValueChange={toggleSwitch}
        value={enabled}
      />
    </View>
  );
};

export default AppSwitch;
