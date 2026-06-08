import React, { FunctionComponent, useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

import { LegalFooter } from "@/components/LegalFooter";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { FormInput } from "@/components/inputs/FormInput";
import AppLayout from "@/components/layouts/AppLayout";
import Logo from "@/components/svgs/logo";
import useAuth from "@/hooks/auth/useAuth";
import { useThemeColors } from "@/hooks/useThemeColor";
import { signupSchema } from "@/schema/authschema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail } from "lucide-react-native";
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ISignUp } from "@/types/authTypes";

const Index: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const {
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ISignUp>({
    defaultValues: { email: "" },
    resolver: yupResolver(signupSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailValue = watch("email");
  const { sendLoginCode } = useAuth();

  const handleSubmit = useCallback(async () => {
    const isValid = await trigger("email");
    if (!isValid) return;

    setIsSubmitting(true);
    const success = await sendLoginCode(emailValue.trim());
    setIsSubmitting(false);

    if (!success) {
      Alert.alert(
        "Unable to send code",
        "Please check your email address and try again.",
      );
    }
  }, [emailValue, sendLoginCode, trigger]);

  return (
    <AppLayout scrollable={false}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top + 170, 225),
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
            Login or sign up
          </ResponsiveUi.Text>

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
                containerStyle={{ height: 48 }}
                hasError={!!errors.email}
                customErrorMsg={errors.email?.message}
                leftIcon={
                  <View
                    style={{
                      backgroundColor: colors.neutral_surface,
                      borderRadius: 8,
                      padding: 6,
                      marginRight: 4,
                    }}
                  >
                    <Mail size={16} color={colors.secondary} />
                  </View>
                }
                rightAction={
                  isSubmitting ? (
                    <ActivityIndicator color={colors.primary} size="small" />
                  ) : (
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={!emailValue?.trim()}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <ResponsiveUi.Text
                        medium
                        style={{
                          color: emailValue?.trim()
                            ? colors.primary
                            : colors.secondary,
                        }}
                      >
                        Submit
                      </ResponsiveUi.Text>
                    </TouchableOpacity>
                  )
                }
                inputProps={{
                  returnKeyType: "go",
                  onSubmitEditing: handleSubmit,
                  style: { height: 48 },
                }}
              />
            )}
          />

          <View style={{ marginTop: 29, maxWidth: 313, alignSelf: "center" }}>
            <LegalFooter lineHeight={20} />
          </View>
        </View>
      </View>
    </AppLayout>
  );
};

export default Index;
