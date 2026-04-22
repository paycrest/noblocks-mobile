import React, { FunctionComponent } from "react";
import { StyleSheet } from "react-native";

import { Radius } from "@/constants/Size";
import { useThemeColors } from "@/hooks/useThemeColor";
import { OtpInput } from "react-native-otp-entry";

interface Props {
  onTextChange: (text: string) => void;
  onFilled: (text: string) => void;
}

const OTPInput: FunctionComponent<Props> = ({ onTextChange, onFilled }) => {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    pinCodeContainer: {
      borderRadius: Radius.large,
      backgroundColor: colors.surface_overlay,
      borderWidth: 0.5,
      height: 48,
      borderColor: colors.place_holder,
    },
    pinCodeText: {
      color: colors.text,
      fontSize: 16,
    },
    container: {},
    focusStick: {},
    activePinCodeContainer: {},
    placeholderText: {},
    filledPinCodeContainer: {},
    disabledPinCodeContainer: {},
  });
  return (
    <OtpInput
      numberOfDigits={6}
      focusColor={colors.slate}
      autoFocus={false}
      hideStick={false}
      placeholder=""
      blurOnFilled={true}
      disabled={false}
      type="numeric"
      secureTextEntry={false}
      focusStickBlinkingDuration={500}
      onFocus={() => console.log("Focused")}
      onBlur={() => console.log("Blurred")}
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
