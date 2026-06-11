import { useThemeColors } from "@/hooks/useThemeColor";
import {
  LIQUID_GLASS_SHEET_BACKDROP_OPACITY,
  LIQUID_GLASS_SHEET_ENTER_MS,
} from "@/lib/transitions/liquidGlassSheet";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Easing, ReduceMotion } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";

interface BaseSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  snapPoints?: Array<string | number>;
  isDismissible?: boolean;
  showBackdrop?: boolean;
  backdropOpacity?: number;
  hideHandle?: boolean;
  topCornerRadius?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const sheetAnimationConfigs = {
  duration: LIQUID_GLASS_SHEET_ENTER_MS,
  easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  reduceMotion: ReduceMotion.System,
};

const BaseSheet: React.FC<BaseSheetProps> = ({
  children,
  isVisible = false,
  onVisibilityChange,
  snapPoints = ["50%"],
  isDismissible = true,
  showBackdrop = true,
  backdropOpacity = LIQUID_GLASS_SHEET_BACKDROP_OPACITY,
  hideHandle = false,
  topCornerRadius,
  backgroundColor,
  borderColor,
}) => {
  const colors = useThemeColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const resolvedSnapPoints = useMemo(
    () => snapPoints,
    [snapPoints.join(",")],
  );
  const cornerStyle = topCornerRadius
    ? {
        borderTopLeftRadius: topCornerRadius,
        borderTopRightRadius: topCornerRadius,
        overflow: "hidden" as const,
      }
    : undefined;

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
      return;
    }

    bottomSheetModalRef.current?.dismiss();
  }, [isVisible]);

  const handleDismiss = useCallback(() => {
    onVisibilityChange?.(false);
  }, [onVisibilityChange]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={backdropOpacity}
        pressBehavior={isDismissible ? "close" : "none"}
        onPress={() => {
          if (!isDismissible) {
            return;
          }

          bottomSheetModalRef.current?.dismiss();
        }}
      />
    ),
    [isDismissible, backdropOpacity],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={resolvedSnapPoints}
      onDismiss={handleDismiss}
      enablePanDownToClose={isDismissible}
      enableOverDrag={false}
      enableDynamicSizing={false}
      animationConfigs={sheetAnimationConfigs}
      backdropComponent={showBackdrop ? renderBackdrop : undefined}
      backgroundStyle={{
        backgroundColor: backgroundColor ?? colors.neutral_surface,
        borderWidth: borderColor ? 0.5 : 0,
        borderColor: borderColor ?? "transparent",
        ...cornerStyle,
      }}
      handleIndicatorStyle={
        hideHandle ? { display: "none" } : { backgroundColor: colors.secondary }
      }
    >
      <View style={[styles.contentContainer, cornerStyle]}>{children}</View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
});

export default BaseSheet;
