import React, { FunctionComponent } from "react";
import { StyleSheet } from "react-native";

import { Radius } from "@/constants/Size";
import { useThemeColors } from "@/hooks/useThemeColor";
import { OtpInput } from "react-native-otp-entry";

interface Props {
  onTextChange: (text: string) => void;
  onFilled?: (text: string) => void;
  disabled?: boolean;
}

const OTP_BOX_SIZE = { width: 44, height: 48 };

const OTPInput: FunctionComponent<Props> = ({
  onTextChange,
  onFilled = () => {},
  disabled = false,
}) => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      justifyContent: "center",
    },
    pinCodeContainer: {
      borderRadius: Radius.large,
      backgroundColor: colors.surface_overlay,
      borderWidth: 1,
      width: OTP_BOX_SIZE.width,
      height: OTP_BOX_SIZE.height,
      borderColor: colors.place_holder,
    },
    pinCodeText: {
      color: colors.text,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    focusStick: {
      backgroundColor: colors.primary,
    },
    activePinCodeContainer: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
    placeholderText: {},
    filledPinCodeContainer: {
      borderColor: colors.gray_hover,
    },
    disabledPinCodeContainer: {
      opacity: 0.5,
    },
  });

  return (
    <OtpInput
      numberOfDigits={6}
      focusColor={colors.primary}
      autoFocus
      hideStick={false}
      placeholder=""
      blurOnFilled={true}
      disabled={disabled}
      type="numeric"
      secureTextEntry={false}
      focusStickBlinkingDuration={500}
      onTextChange={onTextChange}
      onFilled={onFilled}
      textInputProps={{
        accessibilityLabel: "One-Time Password",
      }}
      textProps={{
        accessibilityRole: "text",
        accessibilityLabel: "OTP digit",
        allowFontScaling: false,
      }}
      theme={{
        containerStyle: styles.container,
        pinCodeContainerStyle: styles.pinCodeContainer,
        pinCodeTextStyle: styles.pinCodeText,
        focusStickStyle: styles.focusStick,
        focusedPinCodeContainerStyle: styles.activePinCodeContainer,
        placeholderTextStyle: styles.placeholderText,
        filledPinCodeContainerStyle: styles.filledPinCodeContainer,
        disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
      }}
    />
  );
};

export default OTPInput;
