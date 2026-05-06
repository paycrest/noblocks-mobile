// CustomKeyBoard.tsx
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResponsiveUi } from "../ResponsiveUi";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import BackButton from "../svgs/back-button";
import { useThemeColors } from "@/hooks/useThemeColor";

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "<"],
];

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
  const colors = useThemeColors();

  if (!visible) return null;

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

  const keyWidth = wp(24);
  const keyHeight = hp(6);
  const keyFontSize = hp(3.2);
  const rowGap = wp(3);
  const rowMarginBottom = hp(2);

  return (
    <View
      style={{ paddingBottom: insets.bottom + hp(1.5) }}
      className={`w-full z-50 px-4 items-center ${className ?? ""}`}
    >
      <View className="justify-center py-2">
        {KEYS.map((row, rowIndex) => (
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
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: key === "<" || key === "." ? 0 : 1,
                  borderColor: colors.gray,
                }}
              >
                {key === "<" ? (
                  <BackButton />
                ) : (
                  <ResponsiveUi.Text bold fontSize={keyFontSize}>
                    {key}
                  </ResponsiveUi.Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <ResponsiveUi.Button
          title={submitLabel}
          action={() => onSubmit?.()}
          disabled={submitDisabled}
          medium
          fontSize={hp(2)}
        />
      </View>
    </View>
  );
};

export default CustomKeyBoard;
