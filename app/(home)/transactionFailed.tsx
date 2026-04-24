import TransactionFlowRow from "@/components/cards/TransactionFlowRow";
import AppLayout from "@/components/layouts/AppLayout";
import BaseSheet from "@/components/modals/BottomSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { X, XCircle } from "lucide-react-native";
import React, { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DetailRowProps {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
  valueBold?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  labelColor,
  valueColor,
  valueBold = false,
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <ResponsiveUi.Text fontSize={14} color={labelColor}>
        {label}
      </ResponsiveUi.Text>
      <ResponsiveUi.Text
        fontSize={14}
        color={valueColor}
        tailwind=""
        bold={valueBold}
      >
        {value}
      </ResponsiveUi.Text>
    </View>
  );
};

const TransactionFailed: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { amount, token, recipientName, failureReason } = useLocalSearchParams<{
    amount?: string;
    token?: string;
    recipientName?: string;
    failureReason?: string;
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

    return "20.4 USDT";
  }, [amount, token]);

  const recipientLabel = useMemo(() => {
    const trimmed = recipientName?.trim();
    return _.startCase(_.toLower(trimmed || "Chukwuemeka David Okafor"));
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

    return "The node was acting up and we couldn’t get it to concentrate on the transaction. So sorry man!";
  }, [failureReason]);

  return (
    <AppLayout
      scrollable={false}
      directChild
      statusBarBackgroundColor="transparent"
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View className="flex-1">
        <View
          style={{
            backgroundColor: colors.destructive,
            position: "absolute",
            left: 0,
            right: 0,
            top: -insets.top,
            height: insets.top + 128,
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
            className="flex-1 px-5 pt-4"
            style={{ paddingBottom: insets.bottom + 14 }}
          >
            <X
              size={28}
              color={colors.text}
              style={{ position: "absolute", right: 18, top: 18 }}
              onPress={() => router.back()}
            />

            <View className="mt-12">
              <XCircle size={30} color={colors.destructive} />
              <ResponsiveUi.Text
                medium
                fontSize={20}
                tailwind="mt-5"
                color={colors.text}
              >
                Oops! Transaction failed
              </ResponsiveUi.Text>
            </View>

            <TransactionFlowRow
              amountLabel={amountLabel}
              tokenInitial={tokenInitial}
              recipientLabel={recipientLabel}
              colors={{
                teal: colors.green,
                text: colors.text,
                white: colors.white,
              }}
            />

            <View
              className="mt-5"
              style={{ borderTopWidth: 1, borderTopColor: colors.gray }}
            />

            <ResponsiveUi.Text
              fontSize={14}
              tailwind="mt-5"
              color={colors.secondary}
            >
              Your transfer of{" "}
              <ResponsiveUi.Text color={colors.text} fontSize={14} medium>
                {amountLabel}
              </ResponsiveUi.Text>{" "}
              to {recipientLabel} was unsuccessful.
            </ResponsiveUi.Text>

            <ResponsiveUi.Text
              fontSize={14}
              tailwind="mt-6"
              color={colors.secondary}
            >
              Token will be refunded to your account.
            </ResponsiveUi.Text>

            <View className="mt-6 rounded-3xl px-5 py-5">
              <ResponsiveUi.Text fontSize={14} bold color={colors.text}>
                Reason for failure
              </ResponsiveUi.Text>
              <ResponsiveUi.Text
                fontSize={14}
                tailwind="mt-5"
                color={colors.secondary}
                style={{ lineHeight: 20 }}
              >
                {reasonText}
              </ResponsiveUi.Text>
            </View>

            <View
              className="mt-6"
              style={{ borderTopWidth: 1, borderTopColor: colors.gray }}
            />

            <View className="mt-5" style={{ gap: 16 }}>
              <DetailRow
                label="Transaction status"
                value="Failed"
                labelColor={colors.secondary}
                valueColor={colors.destructive}
                valueBold
              />
              <DetailRow
                label="Fund status"
                value="Deposited"
                labelColor={colors.secondary}
                valueColor={colors.text}
              />
              <DetailRow
                label="Time spent"
                value="12 seconds"
                labelColor={colors.secondary}
                valueColor={colors.text}
              />
              <DetailRow
                label="Onchain receipt"
                value="View in explorer"
                labelColor={colors.secondary}
                valueColor={colors.primary}
              />
            </View>

            <View className="mt-auto pt-8">
              <ResponsiveUi.Button
                title="Retry transaction"
                action={() => router.back()}
                bold
                color={colors.white}
                backgroundColor={colors.slate}
                fontSize={18}
              />
            </View>
          </View>
        </BaseSheet>
      </View>
    </AppLayout>
  );
};

export default TransactionFailed;
