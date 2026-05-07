// BaseSheet.tsx
import { useThemeColors } from "@/hooks/useThemeColor";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface BaseSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  snapPoints?: Array<string | number>;
  isDismissible?: boolean;
  showBackdrop?: boolean;
  hideHandle?: boolean;
  topCornerRadius?: number;
}

const BaseSheet: React.FC<BaseSheetProps> = ({
  children,
  isVisible = false,
  onVisibilityChange,
  snapPoints = ["50%"],
  isDismissible = true,
  showBackdrop = true,
  hideHandle = false,
  topCornerRadius,
}) => {
  const colors = useThemeColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const cornerStyle = topCornerRadius
    ? {
        borderTopLeftRadius: topCornerRadius,
        borderTopRightRadius: topCornerRadius,
        overflow: "hidden" as const,
      }
    : undefined;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isVisible) {
        bottomSheetModalRef.current?.present();
        return;
      }

      bottomSheetModalRef.current?.dismiss();
    }, 0);

    return () => clearTimeout(timeout);
  }, [isVisible]);

  const renderBackdrop = useCallback(
    () => (
      <Pressable
        onPress={() => {
          if (!isDismissible) {
            return;
          }

          onVisibilityChange?.(false);
          bottomSheetModalRef.current?.dismiss();
        }}
        style={styles.backdrop}
      />
    ),
    [isDismissible, onVisibilityChange],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onDismiss={() => onVisibilityChange?.(false)}
      snapPoints={snapPoints}
      style={{ flex: 1 }}
      backdropComponent={showBackdrop ? renderBackdrop : undefined}
      enablePanDownToClose={isDismissible}
      enableOverDrag={false}
      enableDynamicSizing={false}
      backgroundStyle={{
        backgroundColor: colors.neutral_surface,
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
});

export default BaseSheet;
