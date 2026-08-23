import { Href, Redirect } from "expo-router";
import React, { FunctionComponent, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useBoundStore, useSelector } from "@/store/Store";
import { useThemeColors } from "@/hooks/useThemeColor";

const Index: FunctionComponent = () => {
  const colors = useThemeColors();
  const { user, newInstall, _hasHydrated } = useSelector([
    "user",
    "newInstall",
    "_hasHydrated",
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!useBoundStore.getState()._hasHydrated) {
        useBoundStore.setState({ _hasHydrated: true });
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  if (!_hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const initialRoute: Href = newInstall
    ? "/(onboarding)"
    : user
      ? "/(tabs)"
      : "/(auth)/login";
  return <Redirect href={initialRoute} />;
};

export default Index;
