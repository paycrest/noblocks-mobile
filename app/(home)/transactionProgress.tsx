import { fetchPaycrestOrderStatus } from "@/api/queryFns";
import TransactionFlowRow from "@/components/cards/TransactionFlowRow";
import AppLayout from "@/components/layouts/AppLayout";
import BaseSheet from "@/components/modals/BottomSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import TransactionStatusRoller, {
  INDEXING_STATUSES,
} from "@/components/swap/TransactionStatusRoller";
import { useThemeColors } from "@/hooks/useThemeColor";
import { mapPaycrestStatusToUi } from "@/lib/transactions/status";
import { useSelector } from "@/store/Store";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { X } from "lucide-react-native";
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle } from "react-native-svg";

const COUNTDOWN_SECONDS = 12;
const CONTENT_MAX_WIDTH = 321;
const SHEET_PADDING_HORIZONTAL = 20;
const SHEET_TOP_RADIUS = 40;
const COUNTDOWN_SIZE = 231;
const COUNTDOWN_STROKE = 26;
const COUNTDOWN_CAP_RADIUS = 8;

const TERMINAL_ORDER_STATUSES = new Set([
  "settled",
  "validated",
  "refunded",
  "failed",
  "expired",
]);

const TransactionProgress: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { amount, token, recipientName, orderId } = useLocalSearchParams<{
    amount?: string;
    token?: string;
    recipientName?: string;
    orderId?: string;
    network?: string;
  }>();
  const connectorProgress = useRef(new Animated.Value(0)).current;
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const { updateTransactionStatus } = useSelector(["updateTransactionStatus"]);

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

  const processingCopy = useMemo(() => {
    const formattedName = _.startCase(_.toLower(recipientLabel));
    return `Processing payment to ${formattedName}. Hang on, this will only take a few seconds`;
  }, [recipientLabel]);

  const statusHeadline = useMemo(() => {
    const normalized = orderStatus?.trim().toLowerCase();

    if (!normalized || INDEXING_STATUSES.has(normalized)) {
      return "Indexing by aggregator...";
    }

    return `${_.startCase(normalized)}...`;
  }, [orderStatus]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

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
    const trimmedOrderId = orderId?.trim();
    if (!trimmedOrderId) {
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
    }

    let cancelled = false;
    let pollTimeout: ReturnType<typeof setTimeout> | undefined;

    const pollOrderStatus = async () => {
      try {
        const response = await fetchPaycrestOrderStatus(trimmedOrderId);
        const status = response.data?.status?.toLowerCase();

        if (cancelled) {
          return;
        }

        if (status) {
          setOrderStatus(status);
        }

        if (status && TERMINAL_ORDER_STATUSES.has(status)) {
          updateTransactionStatus(
            trimmedOrderId,
            status,
            mapPaycrestStatusToUi(status),
          );

          const nextRoute =
            status === "failed" || status === "expired"
              ? "/(home)/transactionFailed"
              : "/(home)/transactionSuccess";

          router.replace({
            pathname: nextRoute,
            params: {
              amount: amount?.trim() ?? "",
              token: token?.trim() ?? "",
              recipientName: recipientName?.trim() ?? "",
              orderId: trimmedOrderId,
            },
          });
          return;
        }
      } catch {
        // Keep polling while the order is being indexed.
      }

      if (!cancelled) {
        pollTimeout = setTimeout(pollOrderStatus, 5000);
      }
    };

    pollOrderStatus();

    return () => {
      cancelled = true;
      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }
    };
  }, [amount, orderId, recipientName, token, updateTransactionStatus]);

  return (
    <AppLayout
      scrollable={false}
      directChild
      statusBarBackgroundColor="transparent"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={{ flex: 1 }}>
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
          topCornerRadius={SHEET_TOP_RADIUS}
          backgroundColor={colors.surface_canvas}
          borderColor={colors.subtle_surface}
          isDismissible={false}
          showBackdrop={false}
          hideHandle
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: SHEET_PADDING_HORIZONTAL,
              paddingTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                minHeight: 28,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.replace("/(tabs)")}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <X size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: "center",
                marginTop: 62,
              }}
            >
              <AnimatedCircularProgress
                size={COUNTDOWN_SIZE}
                width={COUNTDOWN_STROKE}
                fill={
                  ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100
                }
                tintColor={colors.green}
                lineCap="round"
                fillLineCap="round"
                rotation={0}
                backgroundColor={colors.subtle_surface}
                renderCap={({ center }) => (
                  <Circle
                    cx={center.x}
                    cy={center.y}
                    r={COUNTDOWN_CAP_RADIUS}
                    fill={colors.green}
                  />
                )}
              >
                {() => (
                  <View style={{ alignItems: "center", gap: 6 }}>
                    <ResponsiveUi.Text
                      bold
                      fontSize={44}
                      color={colors.text}
                      style={{ letterSpacing: -0.44, lineHeight: 48 }}
                    >
                      {secondsLeft}
                    </ResponsiveUi.Text>
                    <ResponsiveUi.Text
                      medium
                      fontSize={14}
                      color={colors.secondary}
                      style={{ lineHeight: 20 }}
                    >
                      Secs
                    </ResponsiveUi.Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>

            <View
              style={{
                marginTop: 69,
                width: "100%",
                maxWidth: CONTENT_MAX_WIDTH,
                alignSelf: "center",
                gap: 16,
              }}
            >
              <TransactionStatusRoller status={orderStatus} />

              <ResponsiveUi.Text
                medium
                fontSize={20}
                color={colors.text}
                style={{ lineHeight: 28 }}
              >
                {statusHeadline}
              </ResponsiveUi.Text>

              <TransactionFlowRow
                amountLabel={amountLabel}
                tokenInitial={tokenInitial}
                tokenSymbol={token?.trim()}
                recipientLabel={recipientLabel}
                connectorProgress={connectorProgress}
                colors={{
                  teal: colors.green,
                  text: colors.text,
                  white: colors.white,
                }}
              />

              <View
                style={{
                  borderTopWidth: 0.5,
                  borderTopColor: colors.subtle_surface,
                }}
              />

              <ResponsiveUi.Text
                fontSize={14}
                color={colors.secondary}
                style={{ lineHeight: 20 }}
              >
                {processingCopy}
              </ResponsiveUi.Text>
            </View>
          </View>
        </BaseSheet>
      </View>
    </AppLayout>
  );
};

export default TransactionProgress;
