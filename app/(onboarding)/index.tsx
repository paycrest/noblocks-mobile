import React, { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";

import { LegalFooter } from "@/components/LegalFooter";
import AppLayout from "@/components/layouts/AppLayout";
import OnboardingPageIndicator from "@/components/onboarding/OnboardingPageIndicator";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { router } from "expo-router";
import { useSelector } from "@/store/Store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const onboardingHero = require("@/assets/images/onboarding-hero.png");

const Index: FunctionComponent = () => {
  const { setNewInstall } = useSelector(["setLaunchState", "setNewInstall"]);
  const insets = useSafeAreaInsets();

  return (
    <AppLayout scrollable={false} bottomPadding>
      <View
        style={{
          flex: 1,
          paddingTop: Math.max(insets.top, 11),
          paddingHorizontal: 22,
        }}
      >
        <OnboardingPageIndicator activeIndex={0} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 24,
          }}
        >
          <Image
            source={onboardingHero}
            style={{ width: 340, height: 197 }}
            contentFit="contain"
            accessibilityLabel="Noblocks onboarding illustration"
          />
        </View>

        <View style={{ width: "100%", maxWidth: 349, alignSelf: "center" }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: 40,
              lineHeight: 37,
              color: "#FFFFFF",
            }}
          >
            Crypto to Fiat
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: "CrimsonPro_600SemiBold_Italic",
              fontStyle: "italic",
              fontSize: 52,
              lineHeight: 48,
              color: "#FFFFFF",
            }}
          >
            Easy-peeazzy
          </Text>

          <Text
            allowFontScaling={false}
            style={{
              alignSelf: "center",
              marginTop: 20,
              width: 293,
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              lineHeight: 24,
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.8)",
            }}
          >
            Converting your crypto to fiat has never been easier. No long
            processes
          </Text>

          <ResponsiveUi.Button
            title="Continue"
            backgroundColor="#5D5DC9"
            fontSize={18}
            semiBold
            style={{
              width: 261,
              height: 52,
              borderRadius: 50,
              alignSelf: "center",
              marginTop: 20,
            }}
            btnClassName="self-center"
            action={() => {
              router.push("/(auth)/login");
              setNewInstall(false);
            }}
          />
        </View>

        <View
          style={{
            marginTop: 28,
            marginBottom: Math.max(insets.bottom, 16),
            alignSelf: "center",
            width: 233,
          }}
        >
          <LegalFooter lineHeight={16} />
        </View>
      </View>
    </AppLayout>
  );
};

export default Index;
