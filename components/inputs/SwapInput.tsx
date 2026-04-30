import { useThemeColors } from "@/hooks/useThemeColor";
import React, { FunctionComponent, useMemo } from "react";
import { TextInput, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import { useAppDimensions } from "@/hooks/useAppDimensions";

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

  const { hp } = useAppDimensions();

  return (
    <View
      className="mt-8"
      onStartShouldSetResponder={() => true}
      onResponderStart={(e) => {
        e.stopPropagation && e.stopPropagation();
      }}
    >
      <View className="flex-row items-center justify-between">
        <ResponsiveUi.Text
          medium
          fontSize={18}
          tailwind="flex-1 mr-3"
          numberOfLines={1}
        >
          {selectedAssetSymbol
            ? `${selectedAssetSymbol} ${formattedAmount}`
            : "Amount"}
        </ResponsiveUi.Text>
        <View className="flex-row items-center flex-shrink-0">
          <ResponsiveUi.Text
            medium
            fontSize={hp(3)}
            style={{ color: colors.text }}
          >
            $
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
            style={{
              color: colors.text,
              minWidth: 48,
              maxWidth: 180,
              fontSize: hp(3),
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default SwapInput;
