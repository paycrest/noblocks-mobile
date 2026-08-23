import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import SmartWallet from "@/app/(home)/smartWallet";

const WALLET_PEEK_TIMING = {
  duration: 420,
  easing: Easing.out(Easing.cubic),
};

const DEFAULT_SHEET_PEEK_HEIGHT = 108;

interface Props {
  isWalletPeekOpen: boolean;
  stepper: ReactNode;
  sheet: ReactNode;
  sheetPeekHeight?: number;
}

const SwapFlowWalletPeekLayout: FunctionComponent<Props> = ({
  isWalletPeekOpen,
  stepper,
  sheet,
  sheetPeekHeight = DEFAULT_SHEET_PEEK_HEIGHT,
}) => {
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isMeasuringWallet, setIsMeasuringWallet] = useState(true);
  const walletContentHeight = useSharedValue(0);
  const progress = useSharedValue(0);
  const slideDistance = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isWalletPeekOpen ? 1 : 0, WALLET_PEEK_TIMING);
  }, [isWalletPeekOpen, progress]);

  useEffect(() => {
    slideDistance.value = Math.max(sheetHeight - sheetPeekHeight, 0);
  }, [sheetHeight, sheetPeekHeight, slideDistance]);

  const walletStyle = useAnimatedStyle(() => ({
    height: progress.value * walletContentHeight.value,
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * slideDistance.value }],
  }));

  return (
    <View style={styles.container}>
      {isMeasuringWallet ? (
        <View
          pointerEvents="none"
          style={styles.measureWallet}
          onLayout={(event: LayoutChangeEvent) => {
            const height = event.nativeEvent.layout.height;
            if (height > 0) {
              walletContentHeight.value = height;
              setIsMeasuringWallet(false);
            }
          }}
        >
          <View style={styles.walletContent}>
            <SmartWallet />
          </View>
        </View>
      ) : null}

      <Animated.View
        style={[styles.walletClip, walletStyle]}
        pointerEvents={isWalletPeekOpen ? "auto" : "none"}
      >
        <View style={styles.walletContent}>
          <SmartWallet />
        </View>
      </Animated.View>

      <View style={styles.stepper}>{stepper}</View>

      <View style={styles.sheetClip}>
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          onLayout={(event: LayoutChangeEvent) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight > 0 && nextHeight !== sheetHeight) {
              setSheetHeight(nextHeight);
            }
          }}
        >
          {sheet}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  measureWallet: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  walletClip: {
    overflow: "hidden",
  },
  walletContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  stepper: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  sheetClip: {
    flex: 1,
    marginTop: 8,
    overflow: "hidden",
  },
  sheet: {
    flex: 1,
  },
});

export default SwapFlowWalletPeekLayout;
