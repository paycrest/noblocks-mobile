import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  consumeLiquidGlassBackReplay,
  LIQUID_GLASS_BACK_TARGETS,
  LIQUID_GLASS_EXIT_MS,
  prepareLiquidGlassBack,
  type LiquidGlassVariant,
} from "@/lib/transitions/liquidGlassNavigation";

export function useLiquidGlassScreenTransition(
  stepKey: string,
  variant: LiquidGlassVariant = "step",
) {
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const isAnimatingBackRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (consumeLiquidGlassBackReplay(stepKey)) {
        setAnimationKey((current) => current + 1);
      }

      isAnimatingBackRef.current = false;
    }, [stepKey]),
  );

  const handleExitComplete = useCallback(() => {
    setIsExiting(false);
    isAnimatingBackRef.current = false;
    router.back();
  }, []);

  const goBack = useCallback(
    (
      targetStepKey?: string,
      targetVariant?: LiquidGlassVariant,
    ) => {
      if (isAnimatingBackRef.current || isExiting) {
        return;
      }

      const fallback = LIQUID_GLASS_BACK_TARGETS[stepKey];
      const resolvedTarget = targetStepKey ?? fallback?.stepKey;
      const resolvedVariant = targetVariant ?? fallback?.variant ?? variant;

      if (!resolvedTarget) {
        router.back();
        return;
      }

      isAnimatingBackRef.current = true;
      prepareLiquidGlassBack(resolvedTarget, resolvedVariant);
      setIsExiting(true);
    },
    [isExiting, stepKey, variant],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      const actionType = event.data.action.type;

      if (actionType !== "GO_BACK" && actionType !== "POP") {
        return;
      }

      if (isAnimatingBackRef.current || isExiting) {
        return;
      }

      const fallback = LIQUID_GLASS_BACK_TARGETS[stepKey];
      if (!fallback) {
        return;
      }

      event.preventDefault();
      goBack(fallback.stepKey, fallback.variant);
    });

    return unsubscribe;
  }, [goBack, isExiting, navigation, stepKey]);

  return {
    animationKey,
    isExiting,
    exitDurationMs: LIQUID_GLASS_EXIT_MS,
    goBack,
    handleExitComplete,
  };
}
