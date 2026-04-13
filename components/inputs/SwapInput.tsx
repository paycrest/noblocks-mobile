import { useThemeColors } from "@/hooks/useThemeColor";
import React, { FunctionComponent, useMemo } from "react";
import { TextInput, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface SwapInputProps {
  value: string;
  selectedAssetSymbol?: string;
  onFocus: () => void;
  isDisabled?: boolean;
}

const SwapInput: FunctionComponent<SwapInputProps> = ({
  value,
  selectedAssetSymbol,
  onFocus,
  isDisabled = false,
}) => {
  const colors = useThemeColors();
  const formattedAmount = useMemo(() => {
    if (!value) {
      return "0.00";
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return "0.00";
    }

    return numericValue.toFixed(2);
  }, [value]);

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between">
        <ResponsiveUi.Text medium fontSize={18}>
          {selectedAssetSymbol
            ? `${selectedAssetSymbol} ${formattedAmount}`
            : "Amount"}
        </ResponsiveUi.Text>
        <TextInput
          placeholder="0.00"
          placeholderTextColor={colors.place_holder}
          value={value}
          editable={!isDisabled}
          keyboardType="numeric"
          showSoftInputOnFocus={false}
          cursorColor={colors.primary}
          selectionColor={colors.primary}
          onFocus={() => {
            if (isDisabled) {
              return;
            }

            onFocus();
          }}
          onPressIn={() => {
            if (isDisabled) {
              return;
            }

            onFocus();
          }}
          caretHidden={false}
          className="text-3xl w-32"
          style={{ color: colors.text }}
        />
      </View>
    </View>
  );
};

export default SwapInput;
