// CustomKeyBoard.tsx
import React, { FunctionComponent, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponsiveUi } from "../ResponsiveUi";
import { useAppDimensions } from "@/hooks/useAppDimensions";

interface CustomKeyBoardProps {
  value?: string;
  onChangeText?: (value: string) => void;
  onSubmit?: () => void;
  onDismiss?: () => void;
  onKeyPress?: (key: string) => void;
  visible?: boolean;
  allowDecimal?: boolean;
  maxLength?: number;
  submitLabel?: string;
  submitDisabled?: boolean;
  className?: string;
}

const CustomKeyBoard: FunctionComponent<CustomKeyBoardProps> = ({
  value = "",
  onChangeText,
  onSubmit,
  onDismiss,
  onKeyPress,
  visible = true,
  allowDecimal = true,
  maxLength,
  submitLabel = "Continue",
  submitDisabled = false,
  className,
}) => {
  const insets = useSafeAreaInsets();
  const { hp, wp } = useAppDimensions();

  const inputs = useMemo(
    () => [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      [".", "0", "<"],
    ],
    [],
  );

  const handleKeyPress = (key: string) => {
    onKeyPress?.(key);

    if (key === "<") {
      onChangeText?.(value.slice(0, -1));
      return;
    }

    if (key === ".") {
      if (!allowDecimal || value.includes(".")) {
        return;
      }

      if (!value.length) {
        onChangeText?.("0.");
        return;
      }
    }

    const nextValue = `${value}${key}`;
    if (maxLength && nextValue.length > maxLength) {
      return;
    }

    onChangeText?.(nextValue);
  };

  if (!visible) return null;

  const handleSubmit = () => {
    onSubmit?.();
  };

  // Responsive sizes
  const keyWidth = wp(20); // 20% of screen width
  const keyHeight = hp(7); // 7% of screen height
  const keyFontSize = hp(3.2); // 3.2% of screen height
  const rowGap = wp(15); // 6% of screen width
  const rowMarginBottom = hp(1.5); // 1.5% of screen height

  return (
    <View
      style={{ paddingBottom: insets.bottom + hp(1.5) }}
      className={`w-full z-50 px-4 items-center ${className ?? ""}`}
    >
      <View className="justify-center py-2">
        {inputs.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: rowMarginBottom,
              gap: rowGap,
            }}
          >
            {row.map((key) => (
              <TouchableOpacity
                onPress={() => handleKeyPress(key)}
                key={key}
                style={{
                  width: keyWidth,
                  height: keyHeight,
                  borderRadius: keyWidth / 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ResponsiveUi.Text bold fontSize={keyFontSize}>
                  {key === "<" ? "⌫" : key}
                </ResponsiveUi.Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <ResponsiveUi.Button
          title={submitLabel ?? "Continue"}
          action={handleSubmit}
          disabled={submitDisabled}
          small
        />
      </View>
    </View>
  );
};

export default CustomKeyBoard;
