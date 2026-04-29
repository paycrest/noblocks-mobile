import React, { FunctionComponent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ResponsiveUi } from "@/components/ResponsiveUi";
import { FormInput } from "@/components/inputs/FormInput";
import AppLayout from "@/components/layouts/AppLayout";
import Logo from "@/components/svgs/logo";
import useAuth from "@/hooks/auth/useAuth";
import { useThemeColors } from "@/hooks/useThemeColor";
import { signupSchema } from "@/schema/authschema";
import { yupResolver } from "@hookform/resolvers/yup";
import { View } from "react-native";
import { ISignUp } from "../types/authTypes";
import { ActivityIndicator } from "react-native-paper";

const Index: FunctionComponent = () => {
  const colors = useThemeColors();
  const {
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ISignUp>({
    defaultValues: { email: "" },
    resolver: yupResolver(signupSchema),
  });

  const [isChecking, setIsChecking] = useState(false);
  const emailValue = watch("email");
  const { sendLoginCode } = useAuth();

  useEffect(() => {
    if (!emailValue) return;

    const handler = setTimeout(async () => {
      const isValid = await trigger("email");
      if (!isValid) return;

      setIsChecking(true);
      await sendLoginCode(emailValue);
      setIsChecking(false);
    }, 5000); // debounce after user stops typing

    return () => clearTimeout(handler); // cleanup happens correctly here
  }, [emailValue, trigger]);

  return (
    <AppLayout>
      <View className="justify-center items-center h-[95%]">
        <Logo />
        <ResponsiveUi.Text small medium tailwind="mt-12">
          Login or sign up
        </ResponsiveUi.Text>

        {/* EMAIL INPUT */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <FormInput
              onChangeText={onChange}
              placeholder="your@email.com"
              keyboardType="email-address"
              value={value}
              isProtected={false}
              containerClassName="mt-7 w-full"
              hasError={!!errors.email}
              customErrorMsg={errors.email?.message}
              rightAction={
                isChecking ? <ActivityIndicator color={colors.slate} /> : null
              }
            />
          )}
        />

        {/* Show create account prompt if email not found */}
        {/* <View className="mt-4 items-center border-[0.5px] py-4 px-4 border-secondary dark:border-dark-secondary border-dashed">
          <ResponsiveUi.Text xxs center secondary tailwind="w-80">
            There is no user with this email. Would you like to create an
            account?
          </ResponsiveUi.Text>
        </View> */}

        {/* Password field only if email exists */}
        {/* {emailExists === true && (
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <FormInput
                onChangeText={onChange}
                placeholder="your password"
                keyboardType="default"
                value={value}
                isProtected
                containerClassName="mt-4 w-full"
              />
            )}
          />
        )} */}

        {/* Continue or Create button */}
        {/* {emailExists !== null && (
          <View className="items-center justify-center w-full">
            <ResponsiveUi.Button
              btnClassName="mt-4"
              title={emailExists ? "Continue" : "Create account"}
              action={handleSubmit(onSubmit)}
            />
          </View>
        )} */}

        {/* Terms notice only when email not found */}
        <ResponsiveUi.Text xs secondary tailwind="text-center mx-4 my-4">
          By using Noblocks, you agree to accept our Terms of Use and Privacy
          Policy
        </ResponsiveUi.Text>
      </View>
    </AppLayout>
  );
};

export default Index;
