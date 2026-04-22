import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Easing, LayoutChangeEvent, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { UIActivityIndicator } from "react-native-indicators";
import { Circle } from "react-native-svg";

const ActivityIndicator =
  UIActivityIndicator as unknown as React.ComponentType<{
    color?: string;
    size?: number;
    count?: number;
  }>;

const CONNECTOR_DOT_COUNT = 8;
const MOVING_DOT_SIZE = 16;

const TransactionProgress: FunctionComponent = () => {
  const colors = useThemeColors();
  const { amount, token, recipientName } = useLocalSearchParams<{
    amount?: string;
    token?: string;
    recipientName?: string;
  }>();
  const connectorProgress = useRef(new Animated.Value(0)).current;
  const [connectorWidth, setConnectorWidth] = useState(0);

  const amountLabel = useMemo(() => {
    const trimmedAmount = amount?.trim();
    const trimmedToken = token?.trim();

    if (trimmedAmount && trimmedToken) {
      return `${trimmedAmount} ${trimmedToken}`;
    }

    if (trimmedAmount) {
      return trimmedAmount;
    }

    return "--";
  }, [amount, token]);

  const tokenInitial = useMemo(() => {
    const first = token?.trim()?.charAt(0);
    return first ? first.toUpperCase() : "T";
  }, [token]);

  const recipientLabel = useMemo(() => {
    const trimmedName = recipientName?.trim();
    return trimmedName || "Recipient";
  }, [recipientName]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(connectorProgress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
      connectorProgress.setValue(0);
    };
  }, [connectorProgress]);

  const connectorTranslateX = useMemo(() => {
    const maxTranslate = Math.max(connectorWidth - MOVING_DOT_SIZE, 0);

    return connectorProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, maxTranslate],
    });
  }, [connectorProgress, connectorWidth]);

  const handleConnectorLayout = (event: LayoutChangeEvent) => {
    setConnectorWidth(event.nativeEvent.layout.width);
  };

  return (
    <AppLayout>
      <View className="justify-center items-center mt-20">
        <AnimatedCircularProgress
          size={230}
          width={40}
          fill={20}
          tintColor={colors.teal}
          lineCap="round"
          fillLineCap="round"
          rotation={150}
          onAnimationComplete={() => console.log("onAnimationComplete")}
          backgroundColor={colors.background}
          renderCap={({ center }) => (
            <Circle cx={center.x} cy={center.y} r="4" fill="white" />
          )}
        >
          {(fill: number) => (
            <>
              <ResponsiveUi.Text fontSize={35} bold color={colors.text}>
                {fill}
              </ResponsiveUi.Text>
              <ResponsiveUi.Text fontSize={15} medium color={colors.text}>
                Sec
              </ResponsiveUi.Text>
            </>
          )}
        </AnimatedCircularProgress>
      </View>

      <View className="mt-12 w-full flex-row items-center">
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
            fontSize={18}
            medium
            tailwind="ml-2"
            color={colors.text}
          >
            {amountLabel}
          </ResponsiveUi.Text>
        </View>

        <View
          className="flex-1 mx-3 h-6 justify-center"
          onLayout={handleConnectorLayout}
        >
          <View className="absolute inset-0 flex-row items-center justify-between px-2">
            {Array.from({ length: CONNECTOR_DOT_COUNT }).map((_, index) => (
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
              width: MOVING_DOT_SIZE,
              height: MOVING_DOT_SIZE,
              borderRadius: MOVING_DOT_SIZE / 1.5,
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
          <ResponsiveUi.Text fontSize={18} medium numberOfLines={1}>
            {recipientLabel}
          </ResponsiveUi.Text>
        </View>
      </View>

      <View className="mt-10  py-2  rounded-xl">
        <View className="flex-row rounded-lg w-32 px-2 py-1">
          <ActivityIndicator color={colors.olive2} size={16} count={8} />
          <ResponsiveUi.Text fontSize={16} tailwind="ml-5" color={colors.olive}>
            indexing
          </ResponsiveUi.Text>
        </View>
        <ResponsiveUi.Text
          fontSize={16}
          tailwind="ml-5 mt-8"
          color={colors.text}
        >
          Indexing by aggregator...
        </ResponsiveUi.Text>
      </View>
    </AppLayout>
  );
};

export default TransactionProgress;
