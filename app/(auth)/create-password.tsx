import { CheckCircle2, Circle } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useState } from "react";

import { FormInput } from "@/components/inputs/FormInput";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import Logo from "@/components/svgs/logo";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { router } from "expo-router";
import { View } from "react-native";

const CreatePassword: FunctionComponent = () => {
  const colorScheme = useColorScheme();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<{
    hasEightCharacters: boolean;
    hasNumber: boolean;
    hasSpecialCharacter: boolean;
  }>({
    hasEightCharacters: false,
    hasNumber: false,
    hasSpecialCharacter: false,
  });

  const regexEightChars = /^.{8,}$/; // at least 8 characters
  const regexNumber = /\d/; // at least one digit
  const regexSpecial = /[^A-Za-z0-9]/; // at least one special char

  const handlePasswordStrengthCheck = (password: string) => {
    setPasswordStrength({
      hasEightCharacters: regexEightChars.test(password),
      hasNumber: regexNumber.test(password),
      hasSpecialCharacter: regexSpecial.test(password),
    });
  };

  const Requirement = ({ met }: { met: boolean }) => (
    <View className="flex-row items-center mr-1">
      {met ? (
        <CheckCircle2
          fill={Colors.slate}
          stroke={
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background
          }
          size={16}
        />
      ) : (
        <Circle
          color={
            colorScheme === "dark"
              ? Colors.dark.secondary
              : Colors.light.secondary
          }
          size={16}
        />
      )}
    </View>
  );

  const disabled = useMemo(() => {
    const disabled =
      !passwordStrength.hasEightCharacters ||
      !passwordStrength.hasNumber ||
      !passwordStrength?.hasSpecialCharacter ||
      password !== confirmPassword;
    return disabled;
  }, [passwordStrength, password, confirmPassword]);

  return (
    <AppLayout>
      <View className="flex-1 w-full justify-center items-center">
        <Logo />
        <ResponsiveUi.Text medium tailwind="mt-16">
          Create password
        </ResponsiveUi.Text>
        <FormInput
          onChangeText={(text) => {
            (setPassword(text), handlePasswordStrengthCheck(text));
          }}
          placeholder="create a new password"
          keyboardType="default"
          value={password}
          isProtected={true}
          containerClassName="mt-7 w-full"
        />
        <FormInput
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
          placeholder="create new password"
          keyboardType="default"
          value={confirmPassword}
          isProtected={true}
          containerClassName="mt-7 w-full"
        />
        <View className="flex-row mt-6 w-6/7 flex-wrap justify-center items-center">
          <ResponsiveUi.Text xs>
            Create a strong password with a combination of{" "}
          </ResponsiveUi.Text>
          <Requirement met={passwordStrength.hasEightCharacters} />
          <ResponsiveUi.Text xs>8 characters or more,</ResponsiveUi.Text>
          <Requirement met={passwordStrength.hasNumber} />
          <ResponsiveUi.Text xs>a number </ResponsiveUi.Text>
          <Requirement met={passwordStrength.hasSpecialCharacter} />
          <ResponsiveUi.Text xs>and a special character</ResponsiveUi.Text>
        </View>

        <View className="items-center justify-center mt-3 w-full">
          <ResponsiveUi.Button
            btnClassName="mt-4"
            title="Create account"
            action={() => router.replace("/(auth)/kyc")}
            disabled={disabled}
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default CreatePassword;
