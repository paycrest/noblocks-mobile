import React, { FunctionComponent, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";

import { ONBOARDING_LOGIN_ENTER_MS } from "@/lib/transitions/onboardingLoginNavigation";

interface Props {
  children: ReactNode;
  animate?: boolean;
}

const loginEntering = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ translateY: 52 }, { scale: 0.96 }],
  },
  55: {
    opacity: 0.9,
    transform: [{ translateY: 8 }, { scale: 0.99 }],
  },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
  },
}).duration(ONBOARDING_LOGIN_ENTER_MS);

const OnboardingLoginTransition: FunctionComponent<Props> = ({
  children,
  animate = false,
}) => {
  return (
    <Animated.View
      key={animate ? "login-entry-animated" : "login-entry-static"}
      entering={animate ? loginEntering : undefined}
      style={styles.container}
    >
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default OnboardingLoginTransition;
