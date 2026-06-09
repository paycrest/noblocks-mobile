import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";

import OTPInput from "@/components/inputs/OTPInput";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import Logo from "@/components/svgs/logo";
import useAuth from "@/hooks/auth/useAuth";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RESEND_COOLDOWN_SECONDS = 60;

const OtpScreen: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const emailAddress =
    typeof email === "string" ? email.trim().toLowerCase() : "";
  const { loginUser, resendLoginCode } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleFilled = useCallback(
    async (code: string) => {
      if (!emailAddress || isVerifying) {
        return;
      }

      setVerificationError(null);
      setIsVerifying(true);
      const result = await loginUser(emailAddress, code);
      if (!result.success) {
        setVerificationError(result.message);
      }
      setIsVerifying(false);
    },
    [emailAddress, isVerifying, loginUser],
  );

  const handleResend = useCallback(async () => {
    if (!emailAddress || isResending || resendCooldown > 0) {
      return;
    }

    setIsResending(true);
    const success = await resendLoginCode(emailAddress);
    setIsResending(false);

    if (success) {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setVerificationError(null);
      return;
    }

    Alert.alert(
      "Unable to resend code",
      "Please wait a moment and try again.",
    );
  }, [emailAddress, isResending, resendCooldown, resendLoginCode]);

  return (
    <AppLayout scrollable={false}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top + 184, 239),
        }}
      >
        <View style={{ width: "100%", maxWidth: 353, alignSelf: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Logo />
          </View>

          <ResponsiveUi.Text
            medium
            center
            tailwind="font-inter-medium"
            style={{ fontSize: 16, lineHeight: 24, marginTop: 29 }}
          >
            Enter OTP code sent to your mail
          </ResponsiveUi.Text>

          <View style={{ marginTop: 29, width: "100%" }}>
            <OTPInput
              disabled={isVerifying}
              onTextChange={() => {
                if (verificationError) {
                  setVerificationError(null);
                }
              }}
              onFilled={handleFilled}
            />

            {verificationError ? (
              <Text
                allowFontScaling={false}
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  color: colors.destructive,
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: "Inter_400Regular",
                }}
              >
                {verificationError}
              </Text>
            ) : null}

            {isVerifying ? (
              <View style={{ marginTop: 16, alignItems: "center" }}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleResend}
            disabled={isResending || resendCooldown > 0}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ marginTop: 16 }}
          >
            <ResponsiveUi.Text center secondary style={{ fontSize: 16, lineHeight: 24 }}>
              Didn&apos;t receive a code?{" "}
              <ResponsiveUi.Text
                style={{
                  color:
                    resendCooldown > 0 || isResending
                      ? colors.secondary
                      : colors.primary,
                }}
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend"}
              </ResponsiveUi.Text>
            </ResponsiveUi.Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppLayout>
  );
};

export default OtpScreen;
