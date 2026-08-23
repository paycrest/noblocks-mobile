import React, { FunctionComponent, ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import {
  LIQUID_GLASS_SHEET_BACKDROP_IN_MS,
  LIQUID_GLASS_SHEET_BACKDROP_OPACITY,
  LIQUID_GLASS_SHEET_BACKDROP_OUT_MS,
  LIQUID_GLASS_SHEET_ENTER_MS,
  LIQUID_GLASS_SHEET_EXIT_MS,
  LIQUID_GLASS_SHEET_SWIPE_THRESHOLD,
  liquidGlassSheetEnterAnimation,
  liquidGlassSheetExitAnimation,
} from "@/lib/transitions/liquidGlassSheet";
import Modal from "react-native-modal";

export type SheetPresentation = "bottom" | "center" | "free";

interface Props {
  children: ReactNode;
  onClose: () => void;
  isVisible: boolean;
  avoidKeyboard?: boolean;
  /** How the modal content is anchored inside the overlay. */
  presentation?: SheetPresentation;
  style?: StyleProp<ViewStyle>;
  /** Allow swipe-down to dismiss (default true). */
  swipeToDismiss?: boolean;
}

const presentationStyles: Record<SheetPresentation, ViewStyle> = {
  bottom: { justifyContent: "flex-end" },
  center: { justifyContent: "center" },
  free: {},
};

const BaseModal: FunctionComponent<Props> = ({
  children,
  onClose,
  isVisible,
  avoidKeyboard = true,
  presentation = "free",
  style,
  swipeToDismiss = true,
}) => {
  const allowsSwipe = swipeToDismiss && presentation === "bottom";
  const animationIn =
    presentation === "bottom"
      ? liquidGlassSheetEnterAnimation
      : "fadeIn";
  const animationOut =
    presentation === "bottom"
      ? liquidGlassSheetExitAnimation
      : "fadeOut";

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={allowsSwipe ? onClose : undefined}
      swipeDirection={allowsSwipe ? ["down"] : undefined}
      swipeThreshold={LIQUID_GLASS_SHEET_SWIPE_THRESHOLD}
      propagateSwipe={allowsSwipe}
      avoidKeyboard={avoidKeyboard}
      backdropOpacity={LIQUID_GLASS_SHEET_BACKDROP_OPACITY}
      animationIn={animationIn}
      animationOut={animationOut}
      animationInTiming={LIQUID_GLASS_SHEET_ENTER_MS}
      animationOutTiming={LIQUID_GLASS_SHEET_EXIT_MS}
      backdropTransitionInTiming={LIQUID_GLASS_SHEET_BACKDROP_IN_MS}
      backdropTransitionOutTiming={LIQUID_GLASS_SHEET_BACKDROP_OUT_MS}
      useNativeDriver={false}
      statusBarTranslucent
      style={[
        { margin: 0, padding: 0 },
        presentationStyles[presentation],
        style,
      ]}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
