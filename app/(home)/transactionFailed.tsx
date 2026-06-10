import TransactionFlowRow from "@/components/cards/TransactionFlowRow";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import TransactionResultDetailRow from "@/components/swap/TransactionResultDetailRow";
import TransactionResultLayout, {
  resultPrimaryButtonStyle,
} from "@/components/swap/TransactionResultLayout";
import { RESULT_FLOW_DOT_SIZE, RESULT_SECTION_GAP } from "@/components/swap/transactionResultConstants";
import { useThemeColors } from "@/hooks/useThemeColor";
import { formatAmountLabel } from "@/utils/general";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { XCircle } from "lucide-react-native";
import React, { FunctionComponent, useMemo, useRef } from "react";
import { Animated, View } from "react-native";

const TransactionFailed: FunctionComponent = () => {
  const colors = useThemeColors();
  const staticConnectorProgress = useRef(new Animated.Value(1)).current;
  const { amount, token, recipientName, failureReason } = useLocalSearchParams<{
    amount?: string;
    token?: string;
    recipientName?: string;
    failureReason?: string;
  }>();

  const amountLabel = useMemo(
    () => formatAmountLabel(amount, token),
    [amount, token],
  );

  const recipientLabel = useMemo(() => {
    const trimmed = recipientName?.trim();
    return trimmed ? _.startCase(_.toLower(trimmed)) : "Recipient";
  }, [recipientName]);

  const tokenInitial = useMemo(() => {
    const first = token?.trim()?.charAt(0);
    return first ? first.toUpperCase() : "T";
  }, [token]);

  const reasonText = useMemo(() => {
    const trimmed = failureReason?.trim();

    if (trimmed) {
      return trimmed;
    }

    return "The node was acting up and we couldn't get it to concentrate on the transaction. So sorry man!";
  }, [failureReason]);

  return (
    <AppLayout
      scrollable={false}
      directChild
      statusBarBackgroundColor="transparent"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <TransactionResultLayout
        headerBandColor={colors.destructive}
        onClose={() => router.replace("/(tabs)")}
        icon={<XCircle size={40} color={colors.destructive} />}
        title="Oops! Transaction failed"
        footer={
          <ResponsiveUi.Button
            title="Retry transaction"
            action={() => router.replace("/(tabs)")}
            semiBold
            fontSize={18}
            color={colors.white}
            backgroundColor={colors.slate}
            style={{ ...resultPrimaryButtonStyle, width: "100%" }}
          />
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
          <View style={{ gap: 8 }}>
            <ResponsiveUi.Text fontSize={14} color={colors.secondary} style={{ lineHeight: 20 }}>
              Your transfer of{" "}
              <ResponsiveUi.Text color={colors.text} fontSize={14}>
                {amountLabel}
              </ResponsiveUi.Text>{" "}
              to {recipientLabel} was unsuccessful.
            </ResponsiveUi.Text>
            <ResponsiveUi.Text fontSize={14} color={colors.secondary} style={{ lineHeight: 20 }}>
              Token will be refunded to your account.
            </ResponsiveUi.Text>
          </View>

          <View
            style={{
              backgroundColor: colors.neutral_surface,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 16,
              gap: 8,
            }}
          >
            <ResponsiveUi.Text medium fontSize={14} color={colors.text} style={{ lineHeight: 20 }}>
              Reason for failure
            </ResponsiveUi.Text>
            <ResponsiveUi.Text fontSize={14} color={colors.secondary} style={{ lineHeight: 20 }}>
              {reasonText}
            </ResponsiveUi.Text>
          </View>

          <View
            style={{
              borderTopWidth: 0.5,
              borderTopColor: colors.subtle_surface,
            }}
          />

          <View style={{ gap: RESULT_SECTION_GAP }}>
            <TransactionResultDetailRow
              label="Transaction status"
              value="Failed"
              labelColor={colors.secondary}
              valueColor={colors.destructive}
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
        </View>
      </TransactionResultLayout>
    </AppLayout>
  );
};

export default TransactionFailed;
