import React, { FunctionComponent } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";
import { Radius } from "@/constants/Size";
import { OtpInput } from "react-native-otp-entry";

interface Props {
  onTextChange: (text: string) => void;
}

const OTPInput: FunctionComponent<Props> = ({ onTextChange }) => {
  const scheme = useColorScheme();
  const styles = scheme === "dark" ? darkStyles : lightStyles;
  return (
    <OtpInput
      numberOfDigits={6}
      focusColor={Colors.slate}
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
      onFilled={(text) => console.log(`OTP is ${text}`)}
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

const lightStyles = StyleSheet.create({
  pinCodeContainer: {
    borderRadius: Radius.large,
    backgroundColor: Colors.light.neutral,
    borderWidth: 0,
    height: 48,
  },
  pinCodeText: {
    color: "black",
    fontSize: 16,
  },
  container: {},
  focusStick: {},
  activePinCodeContainer: {},
  placeholderText: {},
  filledPinCodeContainer: {},
  disabledPinCodeContainer: {},
});

const darkStyles = StyleSheet.create({
  pinCodeContainer: {
    borderRadius: Radius.large,
    backgroundColor: Colors.dark.background,
    borderWidth: 0.5,
    borderColor: Colors.dark.gray_hover,
    height: 48,
  },
  pinCodeText: {
    color: "white",
    fontSize: 16,
  },
  container: {},
  focusStick: {},
  activePinCodeContainer: {},
  placeholderText: {},
  filledPinCodeContainer: {},
  disabledPinCodeContainer: {},
});

export default OTPInput;
