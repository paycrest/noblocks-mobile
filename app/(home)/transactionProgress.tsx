import TransactionFlowRow from "@/components/cards/TransactionFlowRow";
import AppLayout from "@/components/layouts/AppLayout";
import BaseSheet from "@/components/modals/BottomSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { X } from "lucide-react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle } from "react-native-svg";

const ActivityIndicator =
  UIActivityIndicator as unknown as React.ComponentType<{
    color?: string;
    size?: number;
    count?: number;
  }>;

const CONNECTOR_DOT_COUNT = 12;
const MOVING_DOT_SIZE = 10;

const TransactionProgress: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
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
    <AppLayout
      scrollable={false}
      directChild
      statusBarBackgroundColor="transparent"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View className="flex-1">
        <LinearGradient
          colors={["#6B7A20", "#2C4E77", "#0B0D13", "#090B10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.72 }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: -insets.top,
          }}
        />

        <BaseSheet
          isVisible
          snapPoints={["92%"]}
          topCornerRadius={40}
          isDismissible={false}
          showBackdrop={false}
          hideHandle
        >
          <View className="flex-1 px-4 pt-2">
            <X
              size={28}
              color={colors.text}
              style={{ position: "absolute", right: 18, top: 18 }}
              onPress={() => router.back()}
            />
            <View className="justify-center items-center mt-20">
              <AnimatedCircularProgress
                size={230}
                width={40}
                fill={90}
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

            <View className="flex-row rounded-lg w-32 mt-16 px-2 py-1">
              <ActivityIndicator color={colors.olive2} size={16} count={8} />
              <ResponsiveUi.Text
                fontSize={16}
                tailwind="ml-5"
                color={colors.olive}
              >
                indexing
              </ResponsiveUi.Text>
            </View>

            <View>
              <ResponsiveUi.Text
                fontSize={18}
                tailwind="ml-5 mt-8"
                color={colors.text}
                medium
              >
                Indexing by aggregator...
              </ResponsiveUi.Text>
            </View>

            <TransactionFlowRow
              amountLabel={amountLabel}
              tokenInitial={tokenInitial}
              recipientLabel={recipientLabel}
              connectorDotCount={CONNECTOR_DOT_COUNT}
              movingDotSize={MOVING_DOT_SIZE}
              connectorTranslateX={connectorTranslateX}
              onConnectorLayout={handleConnectorLayout}
              colors={{
                teal: colors.teal,
                text: colors.text,
                white: colors.white,
              }}
            />

            <View className="mt-2 py-2 rounded-xl">
              <ResponsiveUi.Text
                fontSize={14}
                tailwind="ml-5 mt-8"
                color={colors.secondary}
              >
                Processing payment to {_.startCase(_.toLower(recipientLabel))}.
                Hang on, this will only take a few seconds
              </ResponsiveUi.Text>
            </View>
          </View>
        </BaseSheet>
      </View>
    </AppLayout>
  );
};

export default TransactionProgress;
