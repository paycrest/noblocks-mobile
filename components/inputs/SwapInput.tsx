import { useThemeColors } from "@/hooks/useThemeColor";
import React, { FunctionComponent } from "react";
import { TextInput, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface SwapInputProps {
  value: string;
  selectedAssetSymbol?: string;
  onFocus: () => void;
}

const SwapInput: FunctionComponent<SwapInputProps> = ({
  value,
  selectedAssetSymbol,
  onFocus,
}) => {
  const colors = useThemeColors();
  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between">
        <ResponsiveUi.Text medium fontSize={18}>
          {selectedAssetSymbol ? `${selectedAssetSymbol} amount` : "Amount"}
        </ResponsiveUi.Text>
        <TextInput
          placeholder="0.00"
          value={value}
          keyboardType="numeric"
          showSoftInputOnFocus={false}
          cursorColor={colors.primary}
          onFocus={onFocus}
          onPressIn={onFocus}
          caretHidden={false}
          className="text-3xl w-32"
        />
      </View>
    </View>
  );
};

export default SwapInput;
