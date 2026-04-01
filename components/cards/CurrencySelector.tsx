import { useThemeColors } from "@/hooks/useThemeColor";
import { Plus } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

const CurrencySelector: FunctionComponent = () => {
  const colors = useThemeColors();
  return (
    <View className="mt-8 flex-row px-4 items-center">
      <Plus size={30} color={colors.secondary} />
      <View className="ml-8">
        <ResponsiveUi.Text medium fontSize={16}>
          Receive
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          medium
          fontSize={14}
          tailwind="mt-2"
          color={colors.secondary}
        >
          Select Currency
        </ResponsiveUi.Text>
      </View>
      <TouchableOpacity className="ml-auto">
        <ResponsiveUi.Text medium fontSize={18}>
          Select
        </ResponsiveUi.Text>
      </TouchableOpacity>
    </View>
  );
};

export default CurrencySelector;
