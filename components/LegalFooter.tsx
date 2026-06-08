import React from "react";
import { Text } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColor";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

export const TERMS_URL = "https://noblocks.xyz/terms";
export const PRIVACY_POLICY_URL = "https://noblocks.xyz/privacy-policy";

async function openLegalLink(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch {
    Alert.alert("Unable to open link", "Please try again later.");
  }
}

export function LegalFooter({ lineHeight = 18 }: { lineHeight?: number }) {
  const colors = useThemeColors();

  return (
    <Text
      allowFontScaling={false}
      className="text-center font-inter-regular"
      style={{ color: colors.secondary, fontSize: 12, lineHeight }}
    >
      By using Noblocks, you agree to accept our{" "}
      <Text
        style={{ color: colors.primary }}
        onPress={() => openLegalLink(TERMS_URL)}
      >
        Terms of Use
      </Text>{" "}
      and{" "}
      <Text
        style={{ color: colors.primary }}
        onPress={() => openLegalLink(PRIVACY_POLICY_URL)}
      >
        Privacy Policy
      </Text>
    </Text>
  );
}

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  const visible = localPart.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(localPart.length - 1, 2))}@${domain}`;
}
