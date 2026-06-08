import TransactionFlowRow from "@/components/cards/TransactionFlowRow";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import TransactionResultDetailRow from "@/components/swap/TransactionResultDetailRow";
import TransactionResultLayout, {
  resultPrimaryButtonStyle,
} from "@/components/swap/TransactionResultLayout";
import TransactionResultShareCard from "@/components/swap/TransactionResultShareCard";
import { RESULT_FLOW_DOT_SIZE, RESULT_SECTION_GAP } from "@/components/swap/transactionResultConstants";
import { useThemeColors } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { CheckCircle2 } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useRef } from "react";
import { Animated, View } from "react-native";

const SUCCESS_GREEN = "#39C65D";

const TransactionSuccess: FunctionComponent = () => {
  const colors = useThemeColors();
  const staticConnectorProgress = useRef(new Animated.Value(1)).current;
  const { amount, token, recipientName } = useLocalSearchParams<{
    amount?: string;
    token?: string;
    recipientName?: string;
  }>();

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

  const recipientLabel = useMemo(() => {
    const trimmed = recipientName?.trim();
    return trimmed ? _.startCase(_.toLower(trimmed)) : "Recipient";
  }, [recipientName]);

  const tokenInitial = useMemo(() => {
    const first = token?.trim()?.charAt(0);
    return first ? first.toUpperCase() : "T";
  }, [token]);

  return (
    <AppLayout
      scrollable={false}
      directChild
      statusBarBackgroundColor="transparent"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <TransactionResultLayout
        headerBandColor={SUCCESS_GREEN}
        onClose={() => router.replace("/(tabs)")}
        icon={<CheckCircle2 color={colors.green} size={40} />}
        title="Transaction successful"
        footer={
          <View style={{ flexDirection: "row", gap: 16 }}>
            <ResponsiveUi.Button
              title="Get receipt"
              action={() => {}}
              semiBold
              fontSize={18}
              color={colors.text}
              backgroundColor={colors.subtle_surface}
              style={{ ...resultPrimaryButtonStyle, flex: 1 }}
            />
            <ResponsiveUi.Button
              title="New payment"
              action={() => router.replace("/(tabs)")}
              semiBold
              fontSize={18}
              color={colors.white}
              backgroundColor={colors.slate}
              style={{ ...resultPrimaryButtonStyle, flex: 1 }}
            />
          </View>
        }
      >
        <TransactionFlowRow
          amountLabel={amountLabel}
          tokenInitial={tokenInitial}
          tokenSymbol={token?.trim()}
          recipientLabel={recipientLabel}
          movingDotSize={RESULT_FLOW_DOT_SIZE}
          connectorProgress={staticConnectorProgress}
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

        <View style={{ gap: RESULT_SECTION_GAP }}>
          <ResponsiveUi.Text fontSize={14} color={colors.secondary} style={{ lineHeight: 20 }}>
            Your transfer of{" "}
            <ResponsiveUi.Text color={colors.text} fontSize={14}>
              {amountLabel}
            </ResponsiveUi.Text>{" "}
            to {recipientLabel} has been completed successfully
          </ResponsiveUi.Text>

          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: colors.subtle_surface,
            }}
          />

          <View style={{ gap: RESULT_SECTION_GAP }}>
            <TransactionResultDetailRow
              label="Transaction status"
              value="Completed"
              labelColor={colors.secondary}
              valueColor={colors.green}
            />
            <TransactionResultDetailRow
              label="Fund status"
              value="Deposited"
              labelColor={colors.secondary}
              valueColor={colors.secondary}
            />
            <TransactionResultDetailRow
              label="Time spent"
              value="12 seconds"
              labelColor={colors.secondary}
              valueColor={colors.secondary}
            />
            <TransactionResultDetailRow
              label="Onchain receipt"
              value="View in explorer"
              labelColor={colors.secondary}
              valueColor={colors.primary}
            />
          </View>

          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: colors.subtle_surface,
            }}
          />

          <TransactionResultShareCard />
        </View>
      </TransactionResultLayout>
    </AppLayout>
  );
};

export default TransactionSuccess;
