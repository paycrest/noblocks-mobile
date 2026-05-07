import React, { FunctionComponent } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import OnboardingIcon1 from "@/components/svgs/onboarding-icon1";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { View } from "react-native";
import { router } from "expo-router";
import { useSelector } from "../store/Store";
import { useAppDimensions } from "@/hooks/useAppDimensions";

const Index: FunctionComponent = () => {
  const { setNewInstall } = useSelector(["setLaunchState", "setNewInstall"]);
  const { hp, wp, isLargeScreen } = useAppDimensions();

  const iconTopMargin = isLargeScreen ? hp(8) : hp(12);
  const titleTopMargin = isLargeScreen ? hp(5) : hp(9);
  const descriptionWidth = Math.min(wp(78), 360);
  const ctaWidth = Math.min(wp(70), 320);
  const legalWidth = Math.min(wp(82), 380);

  return (
    <AppLayout bottomPadding>
      <View className="flex-1 justify-center items-center">
        <View style={{ marginTop: iconTopMargin }}>
          <OnboardingIcon1 />
        </View>
        <View className="flex-1 justify-center items-center">
          <View style={{ marginTop: titleTopMargin }} className="items-center">
            <ResponsiveUi.Text xl semiBold>
              Crypto to Fiat
            </ResponsiveUi.Text>
            <ResponsiveUi.Text xl tailwind="font-crimson-regular">
              Easy-Peeazzy
            </ResponsiveUi.Text>
          </View>
          <View style={{ marginVertical: hp(2.2), width: descriptionWidth }}>
            <ResponsiveUi.Text small center tailwind="font-inter-regular">
              Converting your crypto to has never been easier. No long processes
            </ResponsiveUi.Text>
          </View>
          <View
            style={{ width: ctaWidth }}
            className="items-center justify-center"
          >
            <ResponsiveUi.Button
              btnClassName="mt-4"
              title="Continue"
              action={() => {
                router.push("/(auth)/login");
                setNewInstall(false);
              }}
            />
          </View>
          <View style={{ marginTop: hp(4), width: legalWidth }}>
            <ResponsiveUi.Text
              secondary
              xs
              center
              semiBold
              tailwind="font-inter-regular"
            >
              By using Noblocks, you agree to accept our Terms of Use and
              Privacy Policy
            </ResponsiveUi.Text>
          </View>
        </View>
      </View>
    </AppLayout>
  );
};

export default Index;
