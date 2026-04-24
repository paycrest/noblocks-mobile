import { ResponsiveUi } from "@/components/ResponsiveUi";
import _ from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";

export const TRANSACTION_FLOW_ROW_CONNECTOR_DOT_COUNT = 12;
export const TRANSACTION_FLOW_ROW_MOVING_DOT_SIZE = 10;

interface TransactionFlowRowProps {
  amountLabel: string;
  tokenInitial: string;
  recipientLabel: string;
  connectorDotCount?: number;
  movingDotSize?: number;
  connectorProgress?: Animated.Value;
  colors: {
    teal: string;
    text: string;
    white: string;
  };
}

const TransactionFlowRow: React.FC<TransactionFlowRowProps> = ({
  amountLabel,
  tokenInitial,
  recipientLabel,
  connectorDotCount = TRANSACTION_FLOW_ROW_CONNECTOR_DOT_COUNT,
  movingDotSize = TRANSACTION_FLOW_ROW_MOVING_DOT_SIZE,
  connectorProgress,
  colors,
}) => {
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

  return (
    <View className="mt-8 w-full flex-row items-center">
      <View className="px-4 py-3 rounded-full flex-row items-center">
        <View
          className="w-6 h-6 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.teal }}
        >
          <ResponsiveUi.Text color={colors.white} bold fontSize={14}>
            {tokenInitial}
          </ResponsiveUi.Text>
        </View>
        <ResponsiveUi.Text
          fontSize={14}
          medium
          tailwind="ml-2"
          color={colors.text}
        >
          {amountLabel}
        </ResponsiveUi.Text>
      </View>

      <View
        className="flex-1 mx-3 h-6 justify-center"
        onLayout={(event) => setConnectorWidth(event.nativeEvent.layout.width)}
      >
        <View className="absolute inset-0 flex-row items-center justify-between px-2">
          {Array.from({ length: connectorDotCount }).map((_, index) => (
            <View
              key={`connector-dot-${index}`}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: colors.teal, opacity: 0.45 }}
            />
          ))}
        </View>

        <Animated.View
          className="absolute"
          style={{
            transform: [{ translateX: connectorTranslateX }],
            width: movingDotSize,
            height: movingDotSize,
            borderRadius: movingDotSize / 1.5,
            backgroundColor: colors.teal,
            shadowColor: colors.text,
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        />
      </View>

      <View className="px-4 py-3 rounded-full" style={{ maxWidth: "38%" }}>
        <ResponsiveUi.Text fontSize={14} medium numberOfLines={1}>
          {_.startCase(_.toLower(recipientLabel))}
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

export default TransactionFlowRow;
