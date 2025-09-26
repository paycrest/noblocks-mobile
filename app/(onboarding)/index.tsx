import React, { FunctionComponent } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import OnboardingIcon1 from "@/components/svgs/onboarding-icon1";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { View } from "react-native";
import { router } from "expo-router";
import { useSelector } from "../store/Store";

const Index: FunctionComponent = () => {
  const { setNewInstall } = useSelector(["setLaunchState", "setNewInstall"]);

  return (
    <AppLayout bottomPadding>
      <View className="flex-1 justify-center  items-center">
        <OnboardingIcon1 className="mt-32" />
        <View className="flex-1 justify-center items-center">
          <View className="mt-28 items-center">
            <ResponsiveUi.Text xl semiBold>
              Crypto to Fiat
            </ResponsiveUi.Text>
            <ResponsiveUi.Text xl tailwind="font-crimson-regular">
              Easy-Peeazzy
            </ResponsiveUi.Text>
          </View>
          <View className="my-5 w-72">
            <ResponsiveUi.Text small center tailwind="font-inter-regular">
              Converting your crypto to has never been easier. No long processes
            </ResponsiveUi.Text>
          </View>
          <View className="items-center justify-center w-64">
            <ResponsiveUi.Button
              btnClassName="mt-4"
              title="Continue"
              action={() => {
                router.push("/(auth)/login");
                setNewInstall(false);
              }}
            />
          </View>
          <View className="mt-9 w-72">
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
