import React, { FunctionComponent } from "react";
import { Pressable, View } from "react-native";

import { FormInput } from "@/components/inputs/FormInput";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import Logo from "@/components/svgs/logo";

const Index: FunctionComponent = () => {
  return (
    <AppLayout>
      <View className="justify-center items-center h-[95%]">
        <Logo />
        <ResponsiveUi.Text semiBold tailwind="text-3xl mt-6">
          Noblocks
        </ResponsiveUi.Text>
        <ResponsiveUi.Text small medium tailwind="mt-12">
          Login or sign up
        </ResponsiveUi.Text>
        <FormInput
          onChangeText={() => {}}
          placeholder="your@email.com"
          keyboardType="email-address"
          value=""
          isProtected={false}
          containerClassName="my-7 w-full"
        />
        <ResponsiveUi.Text xs tailwind="text-center mx-4">
          By using Noblocks, you agree to accept our Terms of Use and Privacy
          Policy
        </ResponsiveUi.Text>
      </View>
      <View className="flex-row items-center justify-center mt-4">
        <Pressable className="mr-4">
          <ResponsiveUi.Text xs>Privacy Policy</ResponsiveUi.Text>
        </Pressable>
        <Pressable>
          <ResponsiveUi.Text xs>Terms</ResponsiveUi.Text>
        </Pressable>
      </View>
    </AppLayout>
  );
};

export default Index;
