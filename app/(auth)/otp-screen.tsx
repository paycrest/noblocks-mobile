import React, { FunctionComponent } from "react";

import OTPInput from "@/components/inputs/OTPInput";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import Logo from "@/components/svgs/logo";
import { Colors } from "@/constants/Colors";
import useAuth from "@/hooks/auth/useAuth";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const OtpScreen: FunctionComponent = () => {
  const { email } = useLocalSearchParams();
  const { loginUser, sendLoginCode, logoutUser } = useAuth();
  return (
    <AppLayout>
      <View className="flex-1  justify-center items-center">
        <Logo />
        <View className="mt-10">
          <ResponsiveUi.Text center>
            Enter OTP code sent to your mail
          </ResponsiveUi.Text>
          <View className="my-8">
            <OTPInput
              onTextChange={(text) => {}}
              onFilled={(code) => loginUser(email as string, code)}
            />
          </View>
          <ResponsiveUi.Text
            onPress={() => sendLoginCode(email as string)}
            center
          >
            Didn’t receive a code?{" "}
            <ResponsiveUi.Text
              style={{
                color: Colors.slate,
              }}
              tailwind="text-slate"
            >
              Resend
            </ResponsiveUi.Text>
          </ResponsiveUi.Text>
        </View>
      </View>
    </AppLayout>
  );
};

export default OtpScreen;
