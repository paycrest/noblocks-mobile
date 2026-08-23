import WalletIcon from "@/components/svgs/wallet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { X } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { Layout } from "react-native-reanimated";

const DOT_SIZE = 12;
const STEP_GAP = 12;
const PILL_COLOR = "#7c77da";

interface SwapFlowStepperProps {
  activeLabel: string;
  leadingDots?: number;
  trailingDots?: number;
  showActions?: boolean;
  onWalletPress?: () => void;
  onClosePress?: () => void;
}

const StepDot: FunctionComponent<{ colors: ReturnType<typeof useThemeColors> }> = ({
  colors,
}) => (
  <View
    style={{
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.primary_9,
    }}
  />
);

const SwapFlowStepper: FunctionComponent<SwapFlowStepperProps> = ({
  activeLabel,
  leadingDots = 0,
  trailingDots = 0,
  showActions = false,
  onWalletPress,
  onClosePress,
}) => {
  const colors = useThemeColors();

  const stepper = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: STEP_GAP }}>
      {Array.from({ length: leadingDots }).map((_, index) => (
        <StepDot key={`leading-${index}`} colors={colors} />
      ))}
      <Animated.View
        layout={Layout.springify().damping(20).stiffness(170)}
        style={{
          backgroundColor: colors.primary_9,
          borderRadius: 360,
          paddingVertical: 4,
          paddingHorizontal: 8,
        }}
      >
        <ResponsiveUi.Text medium color={PILL_COLOR} fontSize={14}>
          {activeLabel}
        </ResponsiveUi.Text>
      </Animated.View>
      {Array.from({ length: trailingDots }).map((_, index) => (
        <StepDot key={`trailing-${index}`} colors={colors} />
      ))}
    </View>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: showActions ? "space-between" : "flex-start",
        width: "100%",
      }}
    >
      {stepper}
      {showActions ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onWalletPress}
            accessibilityRole="button"
            accessibilityLabel="Open wallet"
          >
            <WalletIcon height={28} width={28} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClosePress}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X color={colors.secondary} size={24} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default SwapFlowStepper;
