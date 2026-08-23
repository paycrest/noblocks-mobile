import React, { FunctionComponent, ReactNode, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  Keyframe,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  consumeLiquidGlassTransition,
  LiquidGlassDirection,
  LiquidGlassVariant,
  LIQUID_GLASS_EXIT_MS,
} from "@/lib/transitions/liquidGlassNavigation";

interface Props {
  children: ReactNode;
  stepKey: string;
  animationKey?: number;
  isExiting?: boolean;
  onExitComplete?: () => void;
}

const buildEntering = (
  direction: LiquidGlassDirection,
  variant: LiquidGlassVariant,
) => {
  if (variant === "entry") {
    if (direction === "back") {
      return new Keyframe({
        0: {
          opacity: 0,
          transform: [{ translateY: -48 }, { scale: 0.945 }],
        },
        55: {
          opacity: 0.9,
          transform: [{ translateY: -8 }, { scale: 0.985 }],
        },
        100: {
          opacity: 1,
          transform: [{ translateY: 0 }, { scale: 1 }],
        },
      }).duration(480);
    }

    return new Keyframe({
      0: {
        opacity: 0,
        transform: [{ translateY: 56 }, { scale: 0.94 }],
      },
      55: {
        opacity: 0.92,
        transform: [{ translateY: 10 }, { scale: 0.985 }],
      },
      100: {
        opacity: 1,
        transform: [{ translateY: 0 }, { scale: 1 }],
      },
    }).duration(520);
  }

  const translateX = direction === "forward" ? 44 : -44;

  return new Keyframe({
    0: {
      opacity: 0,
      transform: [
        { translateX },
        { translateY: 14 },
        { scale: 0.945 },
      ],
    },
    45: {
      opacity: 0.78,
      transform: [
        { translateX: translateX * 0.18 },
        { translateY: 4 },
        { scale: 0.985 },
      ],
    },
    100: {
      opacity: 1,
      transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
    },
  }).duration(500);
};

const LiquidGlassTransition: FunctionComponent<Props> = ({
  children,
  stepKey,
  animationKey = 0,
  isExiting = false,
  onExitComplete,
}) => {
  const { direction, variant, shouldAnimate } = useMemo(
    () => consumeLiquidGlassTransition(),
    [stepKey, animationKey],
  );
  const exitProgress = useSharedValue(0);

  const entering = useMemo(
    () => buildEntering(direction, variant),
    [direction, variant],
  );

  useEffect(() => {
    if (!isExiting) {
      exitProgress.value = 0;
      return;
    }

    exitProgress.value = withTiming(
      1,
      {
        duration: LIQUID_GLASS_EXIT_MS,
        easing: Easing.inOut(Easing.cubic),
      },
      (finished) => {
        if (finished && onExitComplete) {
          runOnJS(onExitComplete)();
        }
      },
    );
  }, [exitProgress, isExiting, onExitComplete]);

  const composedStyle = useAnimatedStyle(() => {
    if (!isExiting) {
      return {};
    }

    if (variant === "entry") {
      return {
        opacity: 1 - exitProgress.value * 0.92,
        transform: [
          { translateY: -exitProgress.value * 52 },
          { scale: 1 - exitProgress.value * 0.04 },
        ],
      };
    }

    return {
      opacity: 1 - exitProgress.value * 0.9,
      transform: [
        { translateX: exitProgress.value * 48 },
        { scale: 1 - exitProgress.value * 0.03 },
      ],
    };
  });

  return (
    <Animated.View
      key={`${stepKey}-${animationKey}`}
      entering={shouldAnimate && !isExiting ? entering : undefined}
      exiting={FadeOut.duration(120)}
      style={[styles.container, composedStyle]}
    >
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
});

export default LiquidGlassTransition;
