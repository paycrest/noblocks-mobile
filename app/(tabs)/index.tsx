if (__DEV__) {
  require("../../ReactotronConfig");
}

import "../../global.css";

import { Text } from "react-native";

import AppLayout from "@/components/layouts/AppLayout";
import useCustomFonts from "@/hooks/useCustomFonts";

export default function HomeScreen() {
  const { loaded } = useCustomFonts();

  if (!loaded) {
    return null;
  }

  return (
    <AppLayout>
      <Text className="text-lg font-interBold text-blue-400 font-semibold">
        Welcome to the Home Screen
      </Text>
    </AppLayout>
  );
}
