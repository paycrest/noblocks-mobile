import React, { FunctionComponent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, View } from "react-native";

import { FormInput } from "@/components/inputs/FormInput";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import Logo from "@/components/svgs/logo";
import { Colors } from "@/constants/Colors";
import { useAppColorScheme } from "@/hooks/useAppColorScheme";
import { signupSchema } from "@/schema/authschema";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

const Index: FunctionComponent = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signupSchema),
  });
  const onSubmit = () => {
    router.replace("/(auth)/otp-screen");
  };
  const scheme = useAppColorScheme();
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [isConfirmingEmail, setIsConfirmingEmail] = useState<boolean>(false);

  const confirmEmailExists = () => {
    setIsConfirmingEmail(true);
    setTimeout(() => {
      setEmailExists(false);
      setIsConfirmingEmail(false);
    }, 5000);
  };

  const emailValue = watch("email");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (emailValue) {
      setIsTyping(true);
      const handler = setTimeout(() => {
        setIsTyping(false);
        console.log("User stopped typing:", emailValue);
        confirmEmailExists();
        // You can trigger validation, API call, etc. here
      }, 2000); // 800ms after last keystroke

      return () => clearTimeout(handler);
    } else {
      setIsTyping(false);
    }
  }, [emailValue]);

  return (
    <AppLayout>
      <View className="justify-center items-center h-[95%]">
        <Logo />
        <ResponsiveUi.Text small medium tailwind="mt-12">
          Login or sign up
        </ResponsiveUi.Text>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <FormInput
              onChangeText={onChange}
              placeholder="your@email.com"
              keyboardType="email-address"
              value={value}
              isProtected={false}
              containerClassName="mt-7 w-full"
              rightAction={
                isConfirmingEmail ? (
                  <ActivityIndicator color={Colors.slate} />
                ) : null
              }
            />
          )}
          name="email"
        />
        {!emailExists && emailExists !== null && (
          <View className="mt-4 items-center border-[0.5px] py-4 px-4 border-secondary dark:border-dark-secondary border-dashed">
            <ResponsiveUi.Text xxs center secondary tailwind="w-80">
              There is no user with this email. Would you like to create an
              account?
            </ResponsiveUi.Text>
          </View>
        )}
        {emailExists && (
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <FormInput
                onChangeText={onChange}
                placeholder="your password"
                keyboardType="email-address"
                value={value}
                isProtected={true}
                containerClassName="mt-4 w-full"
              />
            )}
            name="password"
          />
        )}
        {emailExists && (
          <View className="items-center justify-center w-full">
            <ResponsiveUi.Button
              btnClassName="mt-4"
              title="Continue"
              action={handleSubmit(onSubmit)}
            />
          </View>
        )}
        {!emailExists && emailExists !== null && (
          <View className="items-center justify-center w-full">
            <ResponsiveUi.Button
              btnClassName="mt-4"
              title="Create account"
              action={handleSubmit(onSubmit)}
            />
          </View>
        )}
        {!emailExists && !isConfirmingEmail && (
          <ResponsiveUi.Text xs secondary tailwind="text-center mx-4 my-4">
            By using Noblocks, you agree to accept our Terms of Use and Privacy
            Policy
          </ResponsiveUi.Text>
        )}
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
