import { useThemeColors } from "@/hooks/useThemeColor";
import { formatCurrencyAmount, formatNumbers } from "@/utils/general";
import React, { FunctionComponent, useEffect, useRef } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ResponsiveUi } from "../ResponsiveUi";

interface SwapInputProps {
  value: string;
  selectedAssetSymbol?: string;
  usdDisplay?: string;
  exceedsBalance?: boolean;
  onFocus: () => void;
  isDisabled?: boolean;
}

const SHAKE_OFFSETS = [-8, 8, -5, 5, -2, 2, 0] as const;
const SHAKE_STEP_MS = 45;

const SwapInput: FunctionComponent<SwapInputProps> = ({
  value,
  selectedAssetSymbol,
  usdDisplay = "0",
  exceedsBalance = false,
  onFocus,
  isDisabled = false,
}) => {
  const colors = useThemeColors();
  const inputRef = useRef<TextInput>(null);
  const didExceedBalanceRef = useRef(false);
  const shakeX = useSharedValue(0);
  const isEmpty = !value || value === "0";
  const displayValue = isEmpty ? "" : formatNumbers(value);
  const usdValue = formatCurrencyAmount(usdDisplay || "0");
  const amountColor = exceedsBalance
    ? colors.destructive
    : isEmpty
      ? colors.place_holder
      : colors.text;

  useEffect(() => {
    if (exceedsBalance && !didExceedBalanceRef.current) {
      shakeX.value = withSequence(
        ...SHAKE_OFFSETS.map((offset) =>
          withTiming(offset, { duration: SHAKE_STEP_MS }),
        ),
      );
    }

    didExceedBalanceRef.current = exceedsBalance;
  }, [exceedsBalance, shakeX, value]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const openAmountKeyboard = () => {
    if (isDisabled) {
      return;
    }

    onFocus();
    inputRef.current?.focus();
  };

  return (
    <View style={{ gap: 6, width: "100%", zIndex: 2 }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openAmountKeyboard}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={
          exceedsBalance ? "Enter amount, insufficient balance" : "Enter amount"
        }
        style={{ minHeight: 48, justifyContent: "center", width: "100%" }}
      >
        <Animated.View
          style={shakeStyle}
          className="flex-row items-center px-4 justify-between"
        >
          <View className="flex-row items-center flex-1 mr-3">
            {selectedAssetSymbol ? (
              <ResponsiveUi.Text
                medium
                fontSize={16}
                tailwind="mr-2"
                style={{ color: amountColor }}
              >
                {selectedAssetSymbol}
              </ResponsiveUi.Text>
            ) : null}
            <TextInput
              ref={inputRef}
              placeholder="0"
              placeholderTextColor={colors.place_holder}
              value={displayValue}
              editable={false}
              pointerEvents="none"
              keyboardType="decimal-pad"
              showSoftInputOnFocus={false}
              style={{
                flex: 1,
                color: amountColor,
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
              color: amountColor,
              letterSpacing: -0.24,
            }}
          >
            ${usdValue}
          </ResponsiveUi.Text>
        </Animated.View>
      </TouchableOpacity>
      {exceedsBalance ? (
        <ResponsiveUi.Text
          light
          fontSize={12}
          color={colors.destructive}
          style={{ paddingHorizontal: 16, opacity: 0.9 }}
        >
          Insufficient balance
        </ResponsiveUi.Text>
      ) : null}
    </View>
  );
};

export default SwapInput;
