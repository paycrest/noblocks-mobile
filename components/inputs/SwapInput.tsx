import { useThemeColors } from "@/hooks/useThemeColor";
import React, { FunctionComponent, useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";

interface SwapInputProps {
  value: string;
  selectedAssetSymbol?: string;
  fiatDisplay?: string;
  onFocus: () => void;
  isDisabled?: boolean;
}

const SwapInput: FunctionComponent<SwapInputProps> = ({
  value,
  selectedAssetSymbol,
  fiatDisplay = "0",
  onFocus,
  isDisabled = false,
}) => {
  const colors = useThemeColors();
  const inputRef = useRef<TextInput>(null);
  const isEmpty = !value || value === "0";
  const fiatValue = fiatDisplay || "0";

  const openAmountKeyboard = () => {
    if (isDisabled) {
      return;
    }

    inputRef.current?.focus();
  };

  return (
    <Pressable
      onPress={openAmountKeyboard}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel="Enter amount"
      style={{ minHeight: 48, justifyContent: "center" }}
    >
      <View className="flex-row items-center px-4 justify-between" pointerEvents="box-none">
        <View className="flex-row items-center flex-1 mr-3" pointerEvents="box-none">
          {selectedAssetSymbol ? (
            <ResponsiveUi.Text medium fontSize={16} tailwind="mr-2">
              {selectedAssetSymbol}
            </ResponsiveUi.Text>
          ) : null}
          <TextInput
            ref={inputRef}
            placeholder="0"
            placeholderTextColor={colors.place_holder}
            value={value}
            editable={!isDisabled}
            pointerEvents="none"
            keyboardType="decimal-pad"
            showSoftInputOnFocus={false}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
            onFocus={() => {
              if (isDisabled) {
                return;
              }
              onFocus();
            }}
            style={{
              flex: 1,
              color: isEmpty ? colors.place_holder : colors.text,
              fontSize: 16,
              fontFamily: "Inter_500Medium",
              padding: 0,
              minHeight: 40,
            }}
          />
        </View>
        <ResponsiveUi.Text
          medium
          fontSize={24}
          style={{
            color: isEmpty ? colors.place_holder : colors.text,
            letterSpacing: -0.24,
          }}
        >
          ${fiatValue}
        </ResponsiveUi.Text>
      </View>
    </Pressable>
  );
};

export default SwapInput;
