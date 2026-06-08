import AmountPillIcon from "@/components/swap/AmountPillIcon";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import _ from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

export const TRANSACTION_FLOW_ROW_CONNECTOR_DOT_COUNT = 9;
export const TRANSACTION_FLOW_ROW_MOVING_DOT_SIZE = 18;

function getMovingDotBorderWidth(size: number) {
  return size <= 10 ? 3 : 5;
}
const FLOW_PILL_ICON_SIZE = 14;

interface TransactionFlowRowProps {
  amountLabel: string;
  tokenInitial: string;
  tokenSymbol?: string;
  recipientLabel: string;
  connectorDotCount?: number;
  movingDotSize?: number;
  connectorProgress?: Animated.Value;
  logoUri?: string;
  colors: {
    teal: string;
    text: string;
    white: string;
  };
}

const TransactionFlowRow: React.FC<TransactionFlowRowProps> = ({
  amountLabel,
  tokenInitial,
  tokenSymbol,
  recipientLabel,
  connectorDotCount = TRANSACTION_FLOW_ROW_CONNECTOR_DOT_COUNT,
  movingDotSize = TRANSACTION_FLOW_ROW_MOVING_DOT_SIZE,
  connectorProgress,
  colors,
  logoUri,
}) => {
  const themeColors = useThemeColors();
  const movingDotBorderWidth = getMovingDotBorderWidth(movingDotSize);
  const staticConnectorProgress = useRef(new Animated.Value(0)).current;
  const resolvedConnectorProgress =
    connectorProgress ?? staticConnectorProgress;
  const [connectorWidth, setConnectorWidth] = useState(0);

  useEffect(() => {
    if (connectorProgress) {
      return;
    }

    const animation = Animated.loop(
      Animated.timing(staticConnectorProgress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      staticConnectorProgress.setValue(0);
    };
  }, [connectorProgress, staticConnectorProgress]);

  const connectorTranslateX = useMemo(() => {
    const maxTranslate = Math.max(connectorWidth - movingDotSize, 0);

    return resolvedConnectorProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, maxTranslate],
    });
  }, [connectorWidth, movingDotSize, resolvedConnectorProgress]);

  const truncatedRecipient = useMemo(() => {
    const formatted = _.startCase(_.toLower(recipientLabel));
    return _.truncate(formatted, { length: 12, omission: ".." });
  }, [recipientLabel]);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          backgroundColor: themeColors.neutral_surface,
          borderRadius: 360,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <AmountPillIcon
          symbol={tokenSymbol ?? tokenInitial}
          uri={logoUri}
          size={FLOW_PILL_ICON_SIZE}
        />
        <ResponsiveUi.Text medium fontSize={14} color={colors.text}>
          {amountLabel}
        </ResponsiveUi.Text>
      </View>

      <View
        style={{
          flex: 1,
          height: movingDotSize + movingDotBorderWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
        onLayout={(event) => setConnectorWidth(event.nativeEvent.layout.width)}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 2,
          }}
        >
          {Array.from({ length: connectorDotCount }).map((_, index) => (
            <View
              key={`connector-dot-${index}`}
              style={{
                width: 2.5,
                height: 2.5,
                borderRadius: 2.5,
                backgroundColor: themeColors.subtle_surface,
              }}
            />
          ))}
        </View>

        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: [
              { translateX: connectorTranslateX },
              { translateY: -(movingDotSize / 2) },
            ],
            width: movingDotSize,
            height: movingDotSize,
            borderRadius: movingDotSize / 2,
            backgroundColor: colors.teal,
            borderWidth: movingDotBorderWidth,
            borderColor: themeColors.surface_overlay,
            shadowColor: "#121217",
            shadowOpacity: movingDotSize <= 10 ? 0.1 : 0.35,
            shadowRadius: movingDotSize <= 10 ? 4 : 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: movingDotSize <= 10 ? 2 : 4,
          }}
        />
      </View>

      <View
        style={{
          backgroundColor: themeColors.subtle_surface,
          borderRadius: 360,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <ResponsiveUi.Text fontSize={14} color={colors.text} numberOfLines={1}>
          {truncatedRecipient}
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

export default TransactionFlowRow;
