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

const KEY_WIDTH = 104;
const KEY_HEIGHT = 48;
const KEY_GAP = 12;
const KEY_RADIUS = 12;

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
  onKeyPress,
  visible = true,
  allowDecimal = true,
  maxLength,
  submitLabel = "Continue",
  submitDisabled = false,
  className,
}) => {
  const insets = useSafeAreaInsets();
  const { wp } = useAppDimensions();
  const colors = useThemeColors();

  if (!visible) return null;

  const keyWidth = Math.min(KEY_WIDTH, wp(26.5));
  const padWidth = Math.min(336, wp(85.5));

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

  return (
    <View
      style={{ paddingBottom: insets.bottom + 8 }}
      className={`w-full z-50 items-center ${className ?? ""}`}
    >
      <View style={{ width: padWidth, paddingTop: 8 }}>
        {KEYS.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: KEY_GAP,
              gap: KEY_GAP,
            }}
          >
            {row.map((key) => {
              const isGhostKey = key === "<" || key === ".";
              return (
                <TouchableOpacity
                  onPress={() => handleKeyPress(key)}
                  key={key}
                  style={{
                    width: keyWidth,
                    height: KEY_HEIGHT,
                    borderRadius: KEY_RADIUS,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: isGhostKey ? 0 : 0.5,
                    borderColor: colors.subtle_surface,
                    backgroundColor: isGhostKey
                      ? "transparent"
                      : colors.neutral_surface,
                  }}
                >
                  {key === "<" ? (
                    <BackButton />
                  ) : (
                    <ResponsiveUi.Text semiBold fontSize={28}>
                      {key}
                    </ResponsiveUi.Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <TouchableOpacity
          disabled={submitDisabled}
          activeOpacity={0.85}
          onPress={() => onSubmit?.()}
          style={{
            width: Math.min(361, wp(92)),
            height: 52,
            borderRadius: 50,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            opacity: submitDisabled ? 0.4 : 1,
            marginTop: 4,
          }}
        >
          <ResponsiveUi.Text semiBold fontSize={18} color={colors.white}>
            {submitLabel}
          </ResponsiveUi.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomKeyBoard;
