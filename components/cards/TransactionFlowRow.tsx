import { ResponsiveUi } from "@/components/ResponsiveUi";
import _ from "lodash";
import React from "react";
import { Animated, LayoutChangeEvent, View } from "react-native";

interface TransactionFlowRowProps {
  amountLabel: string;
  tokenInitial: string;
  recipientLabel: string;
  connectorDotCount: number;
  movingDotSize: number;
  connectorTranslateX: Animated.AnimatedInterpolation<string | number>;
  onConnectorLayout: (event: LayoutChangeEvent) => void;
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
  connectorDotCount,
  movingDotSize,
  connectorTranslateX,
  onConnectorLayout,
  colors,
}) => {
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
        onLayout={onConnectorLayout}
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
