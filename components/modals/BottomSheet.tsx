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
}

const BaseSheet: React.FC<BaseSheetProps> = ({
  children,
  isVisible = false,
  onVisibilityChange,
  snapPoints = ["50%"],
}) => {
  const colors = useThemeColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
          onVisibilityChange?.(false);
          bottomSheetModalRef.current?.dismiss();
        }}
        style={styles.backdrop}
      />
    ),
    [onVisibilityChange],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onDismiss={() => onVisibilityChange?.(false)}
      snapPoints={snapPoints}
      style={{ flex: 1 }}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      enableOverDrag={false}
      enableDynamicSizing={false}
      backgroundStyle={{ backgroundColor: colors.surface_overlay }}
      handleIndicatorStyle={{ backgroundColor: colors.secondary }}
    >
      <View style={styles.contentContainer}>{children}</View>
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
