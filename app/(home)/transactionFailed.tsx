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
import { useAppDimensions } from "@/hooks/useAppDimensions";
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
  const { hp } = useAppDimensions();
  return (
    <View className="flex-row items-center justify-between">
      <ResponsiveUi.Text fontSize={hp(1.8)} color={labelColor}>
        {label}
      </ResponsiveUi.Text>
      <ResponsiveUi.Text
        fontSize={hp(1.8)}
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
  const { hp, wp } = useAppDimensions();
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
            style={{
              flex: 1,
              paddingHorizontal: wp(5),
              paddingTop: hp(2),
              paddingBottom: insets.bottom + hp(2.5),
            }}
          >
            <X
              size={28}
              color={colors.text}
              style={{ position: "absolute", right: 18, top: 18 }}
              onPress={() => router.back()}
            />

            <View style={{ marginTop: hp(4), alignItems: "center" }}>
              <XCircle size={hp(4)} color={colors.destructive} />
              <ResponsiveUi.Text
                medium
                fontSize={hp(2.2)}
                style={{ marginTop: hp(1.5) }}
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
              style={{
                marginTop: hp(2),
                borderTopWidth: 1,
                borderTopColor: colors.gray,
              }}
            />

            <ResponsiveUi.Text
              fontSize={hp(1.7)}
              style={{ marginTop: hp(1.5) }}
              color={colors.secondary}
            >
              Your transfer of{" "}
              <ResponsiveUi.Text color={colors.text} fontSize={hp(2)} medium>
                {amountLabel}
              </ResponsiveUi.Text>{" "}
              to {recipientLabel} was unsuccessful.
            </ResponsiveUi.Text>

            <ResponsiveUi.Text
              fontSize={hp(1.7)}
              style={{ marginTop: hp(2.5) }}
              color={colors.secondary}
            >
              Token will be refunded to your account.
            </ResponsiveUi.Text>

            <View
              style={{
                marginTop: hp(2.5),
                borderRadius: hp(2),
                paddingHorizontal: wp(4),
                paddingVertical: hp(2),
                backgroundColor: colors.subtle_surface,
              }}
            >
              <ResponsiveUi.Text fontSize={hp(1.7)} bold color={colors.text}>
                Reason for failure
              </ResponsiveUi.Text>
              <ResponsiveUi.Text
                fontSize={hp(1.7)}
                style={{ marginTop: hp(1.2), lineHeight: hp(2.2) }}
                color={colors.secondary}
              >
                {reasonText}
              </ResponsiveUi.Text>
            </View>

            <View
              style={{
                marginTop: hp(2.5),
                borderTopWidth: 1,
                borderTopColor: colors.gray,
              }}
            />

            <View style={{ marginTop: hp(1.5), gap: hp(1.5) }}>
              <DetailRow
                label="Transaction status"
                value="Failed"
                labelColor={colors.secondary}
                valueColor={colors.destructive}
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

            <View style={{ marginTop: "auto", paddingTop: hp(3) }}>
              <ResponsiveUi.Button
                title="Retry transaction"
                action={() => router.back()}
                bold
                color={colors.white}
                backgroundColor={colors.slate}
                fontSize={hp(2)}
                style={{ minHeight: hp(5.5) }}
              />
            </View>
          </View>
        </BaseSheet>
      </View>
    </AppLayout>
  );
};

export default TransactionFailed;
