// CustomKeyBoard.tsx
import React, { FunctionComponent, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponsiveUi } from "../ResponsiveUi";

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
  className,
}) => {
  const insets = useSafeAreaInsets();

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
    onDismiss?.();
  };

  return (
    <View
      style={{ paddingBottom: insets.bottom + 4 }}
      className={`w-full z-50 px-4 items-center  ${className ?? ""}`}
    >
      <View className="justify-center py-4">
        {inputs.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-center gap-16 mb-4">
            {row.map((key) => (
              <TouchableOpacity
                onPress={() => handleKeyPress(key)}
                key={key}
                className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center"
              >
                <ResponsiveUi.Text bold fontSize={28}>
                  {key === "<" ? "⌫" : key}
                </ResponsiveUi.Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <ResponsiveUi.Button
          title={submitLabel ?? "Continue"}
          action={handleSubmit}
          small
        />
      </View>
    </View>
  );
};

export default CustomKeyBoard;
