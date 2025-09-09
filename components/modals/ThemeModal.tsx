import { CheckCircle2, X } from "lucide-react-native";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";
import lodash from "lodash";
import { useColorScheme } from "nativewind";
import Modal from "react-native-modal";
import tw from "twrnc";
import { ResponsiveUi } from "../ResponsiveUi";
import DarkAppearanceIcon from "../svgs/dark-appearance-icon";
import LightAppearanceIcon from "../svgs/light-appearance-icon";
import SystemAppearanceIcon from "../svgs/system-appearance-icon";

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
      style={tw`flex-row justify-between items-center mb-4`}
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
  const currentTheme = useColorScheme();

  const [selectedTheme, setSelectedTheme] = useState<theme>(
    lodash.upperFirst(currentTheme.colorScheme)
  );
  const handleThemeChange = (theme: theme) => {
    currentTheme.setColorScheme(
      theme.toLowerCase() as "dark" | "light" | "system"
    );
    setSelectedTheme(theme);
  };
  return (
    <View>
      <Modal
        onBackdropPress={onClose}
        isVisible={isVisible}
        backdropOpacity={0.9}
      >
        <View
          style={{
            height: 300,
            position: "absolute",
            width: "100%",
            bottom: 10,
            borderRadius: 40,
            backgroundColor: colors.background,
            padding: 20,
          }}
        >
          <View style={tw`flex-row items-center justify-between`}>
            <ResponsiveUi.Text semiBold>Appearance</ResponsiveUi.Text>
            <X onPress={onClose} size={20} color={colors.secondary} />
          </View>
          <View className="mt-6 ">
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
      </Modal>
    </View>
  );
};

export default ThemeModal;
