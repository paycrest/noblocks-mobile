import { CheckCircle2, X } from "lucide-react-native";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useSelector } from "@/app/store/Store";
import { useThemeColors } from "@/hooks/useThemeColor";
import lodash from "lodash";
import { ResponsiveUi } from "../ResponsiveUi";
import DarkAppearanceIcon from "../svgs/dark-appearance-icon";
import LightAppearanceIcon from "../svgs/light-appearance-icon";
import SystemAppearanceIcon from "../svgs/system-appearance-icon";
import BackdropBlur from "./BackdropBlur";
import BaseModal from "./BaseModal";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

type theme = "Dark" | "Light" | "System";

interface SelectorItem {
  icon: ReactElement;
  title: theme;
}

interface SelectorProps extends SelectorItem {
  selectedTheme: theme;
  onPress: () => void;
}

const themes: SelectorItem[] = [
  {
    title: "Dark",
    icon: <DarkAppearanceIcon />,
  },
  {
    title: "Light",
    icon: <LightAppearanceIcon />,
  },
  {
    title: "System",
    icon: <SystemAppearanceIcon />,
  },
];

const AppearanceSelector: FunctionComponent<SelectorProps> = ({
  icon,
  title,
  selectedTheme,
  onPress,
}) => {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-row justify-between items-center mb-4"
    >
      <View className="flex-row items-center">
        {icon}
        <ResponsiveUi.Text small semiBold tailwind="ml-4">
          {title}
        </ResponsiveUi.Text>
      </View>
      {selectedTheme === title && (
        <CheckCircle2 size={20} color={colors.slate} />
      )}
    </TouchableOpacity>
  );
};

const ThemeModal: FunctionComponent<Props> = ({ isVisible, onClose }) => {
  const colors = useThemeColors();
  const {appTheme, setAppTheme} = useSelector(["appTheme", "setAppTheme"])

  const [selectedTheme, setSelectedTheme] = useState<theme>(
    lodash.upperFirst(appTheme)
  );
  const handleThemeChange = (theme: theme) => {
    setAppTheme(
      theme.toLowerCase() as "dark" | "light" | "system"
    );
    setSelectedTheme(theme);
  };

  return (
    <BaseModal isVisible={isVisible} onClose={onClose}>
      <>
        <BackdropBlur onClose={onClose} />
        <View
          style={{
            height: 300,
            position: "absolute",
            width: "90%",
            bottom: 10,
            borderRadius: 40,
            backgroundColor: colors.surface_overlay,
            padding: 20,
            marginHorizontal: 20,
            marginBottom: 20,
            alignSelf: "center",
          }}
        >
          <View className="flex flex-row items-center justify-between">
            <ResponsiveUi.Text semiBold>Appearance</ResponsiveUi.Text>
            <X onPress={onClose} size={20} color={colors.secondary} />
          </View>
          <View className="mt-6">
            {themes.map((theme) => (
              <AppearanceSelector
                key={theme.title}
                {...theme}
                onPress={() => handleThemeChange(theme.title)}
                selectedTheme={selectedTheme}
              />
            ))}
          </View>
        </View>
      </>
    </BaseModal>
  );
};

export default ThemeModal;
