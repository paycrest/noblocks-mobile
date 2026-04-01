// BaseSheet.tsx
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface BaseSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

const BaseSheet: React.FC<BaseSheetProps> = ({
  children,
  isVisible = false,
  onVisibilityChange,
}) => {
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
        className=" absolute top-0 left-0 right-0 bottom-0"
      />
    ),
    [onVisibilityChange],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onDismiss={() => onVisibilityChange?.(false)}
      snapPoints={["50%"]}
      style={{ flex: 1 }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View className="flex-1">{children}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BaseSheet;
