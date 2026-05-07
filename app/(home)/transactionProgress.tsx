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
import React, { FunctionComponent, useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { useAppDimensions } from "@/hooks/useAppDimensions";
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

const TransactionProgress: FunctionComponent = () => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();
  const insets = useSafeAreaInsets();
  const { amount, token, recipientName } = useLocalSearchParams<{
    amount?: string;
    token?: string;
    recipientName?: string;
  }>();
  const connectorProgress = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace({
        pathname: "/(home)/transactionSuccess",
        params: {
          amount: amount?.trim() ?? "",
          token: token?.trim() ?? "",
          recipientName: recipientName?.trim() ?? "",
        },
      });
    }, 3500);
    return () => clearTimeout(timeout);
  }, [amount, token, recipientName]);

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
          <View
            style={{
              flex: 1,
              paddingHorizontal: wp(4),
              paddingTop: hp(1.5),
            }}
          >
            <X
              size={hp(3.5)}
              color={colors.text}
              style={{ position: "absolute", right: wp(4), top: hp(2.2) }}
              onPress={() => router.back()}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: hp(8),
              }}
            >
              <AnimatedCircularProgress
                size={wp(60)}
                width={wp(10)}
                fill={90}
                tintColor={colors.teal}
                lineCap="round"
                fillLineCap="round"
                rotation={150}
                onAnimationComplete={() => console.log("onAnimationComplete")}
                backgroundColor={colors.background}
                renderCap={({ center }) => (
                  <Circle
                    cx={center.x}
                    cy={center.y}
                    r={hp(0.7)}
                    fill="white"
                  />
                )}
              >
                {(fill: number) => (
                  <>
                    <ResponsiveUi.Text
                      fontSize={hp(4.2)}
                      bold
                      color={colors.text}
                    >
                      {fill}
                    </ResponsiveUi.Text>
                    <ResponsiveUi.Text
                      fontSize={hp(1.8)}
                      medium
                      color={colors.text}
                    >
                      Sec
                    </ResponsiveUi.Text>
                  </>
                )}
              </AnimatedCircularProgress>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderRadius: 12,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                overflow: "hidden",
                width: wp(32),
                marginTop: hp(7),
                paddingHorizontal: wp(2),
                paddingVertical: hp(1),
              }}
            >
              <ActivityIndicator color={colors.olive2} size={hp(2)} count={8} />
              <ResponsiveUi.Text
                fontSize={hp(2)}
                style={{ marginLeft: wp(3) }}
                color={colors.olive}
              >
                indexing
              </ResponsiveUi.Text>
            </View>

            <View>
              <ResponsiveUi.Text
                fontSize={hp(2.2)}
                style={{ marginLeft: wp(3), marginTop: hp(3) }}
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
              connectorProgress={connectorProgress}
              colors={{
                teal: colors.teal,
                text: colors.text,
                white: colors.white,
              }}
            />

            <View
              style={{
                marginTop: hp(1.5),
                paddingVertical: hp(1.2),
                borderRadius: 16,
              }}
            >
              <ResponsiveUi.Text
                fontSize={hp(1.8)}
                style={{ marginLeft: wp(3), marginTop: hp(3) }}
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
