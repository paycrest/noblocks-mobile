import { createPaycrestSenderOrder } from "@/api/queryFns";
import SwapChainRow from "@/components/cards/SwapChainRow";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import AmountPillIcon from "@/components/swap/AmountPillIcon";
import SwapFlowStepper from "@/components/swap/SwapFlowStepper";
import SwapScreenSheet from "@/components/swap/SwapScreenSheet";
import BackArrow from "@/components/svgs/back-arrow";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { CircleHelp } from "lucide-react-native";
import _ from "lodash";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DETAIL_ROW_ICON_SIZE = 16;

interface DetailRowProps {
  label: string;
  value: string;
  valueIconUri?: string;
  valueIconSymbol?: string;
  showHelpIcon?: boolean;
  onHelpPress?: () => void;
}

const DetailRow: FunctionComponent<DetailRowProps> = ({
  label,
  value,
  valueIconUri,
  valueIconSymbol,
  showHelpIcon = false,
  onHelpPress,
}) => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
          {label}
        </ResponsiveUi.Text>
        {showHelpIcon ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onHelpPress}
            accessibilityRole="button"
            accessibilityLabel="Fees information"
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <CircleHelp size={20} color={colors.secondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", maxWidth: "62%" }}
      >
        {valueIconSymbol ? (
          <View style={{ marginRight: 4 }}>
            <AmountPillIcon
              symbol={valueIconSymbol}
              uri={valueIconUri}
              size={DETAIL_ROW_ICON_SIZE}
            />
          </View>
        ) : valueIconUri ? (
          <Image
            source={{ uri: valueIconUri }}
            style={{
              width: DETAIL_ROW_ICON_SIZE,
              height: DETAIL_ROW_ICON_SIZE,
              borderRadius: DETAIL_ROW_ICON_SIZE / 2,
              marginRight: 4,
            }}
            contentFit="cover"
          />
        ) : null}
        <ResponsiveUi.Text
          fontSize={14}
          medium
          color={colors.text}
          style={{ textAlign: "right" }}
          numberOfLines={2}
        >
          {value}
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

const AccountValue: FunctionComponent<{
  accountNumber: string;
  bankName: string;
}> = ({ accountNumber, bankName }) => {
  const colors = useThemeColors();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <ResponsiveUi.Text fontSize={14} medium color={colors.text}>
        {accountNumber}
      </ResponsiveUi.Text>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.gray2,
        }}
      />
      <ResponsiveUi.Text fontSize={14} medium color={colors.text}>
        {bankName}
      </ResponsiveUi.Text>
    </View>
  );
};

const ReviewTransaction: FunctionComponent = () => {
  const colors = useThemeColors();
  const { hp, wp, isLargeScreen } = useAppDimensions();
  const insets = useSafeAreaInsets();
  const { wallets } = useEmbeddedEthereumWallet();
  const {
    amount,
    fromChainKey,
    fromChainName,
    fromChainLogoUri,
    fromAssetSymbol,
    fromAssetUri,
    toFiatCode,
    toFiatUri,
    fiatEstimate,
    rate,
    recipientAccountName,
    recipientInstitutionCode,
    recipientAccountNumber,
    recipientInstitutionName,
    fee,
    memo,
  } = useLocalSearchParams<{
    amount?: string;
    fromChainKey?: string;
    fromChainName?: string;
    fromChainLogoUri?: string;
    fromAssetSymbol?: string;
    fromAssetUri?: string;
    toFiatCode?: string;
    toFiatUri?: string;
    fiatEstimate?: string;
    recipientAccountName?: string;
    recipientInstitutionCode?: string;
    recipientAccountNumber?: string;
    recipientInstitutionName?: string;
    fee?: string;
    rate?: string;
    memo?: string;
  }>();

  const { mutateAsync: createSenderOrder, isPending: isCreatingOrder } =
    useMutation({ mutationFn: createPaycrestSenderOrder });

  const contentMaxWidth = isLargeScreen ? Math.min(wp(82), 361) : 361;
  const detailsMaxWidth = isLargeScreen ? Math.min(wp(78), 321) : 321;

  const amountValue = useMemo(() => {
    if (!amount) {
      return "--";
    }

    return fromAssetSymbol ? `${amount} ${fromAssetSymbol}` : amount;
  }, [amount, fromAssetSymbol]);

  const feeValue = useMemo(() => {
    if (fee && toFiatCode) {
      return `${toFiatCode} ${fee}`;
    }

    if (fee) {
      return fee;
    }

    return toFiatCode ? `${toFiatCode} 0` : "0";
  }, [fee, toFiatCode]);

  const totalFiatValue = useMemo(() => {
    if (!fiatEstimate) {
      return "--";
    }

    return toFiatCode ? `${toFiatCode} ${fiatEstimate}` : fiatEstimate;
  }, [fiatEstimate, toFiatCode]);

  const memoValue = useMemo(() => {
    const sanitizedMemo = memo?.trim();
    return sanitizedMemo ? sanitizedMemo : "No memo";
  }, [memo]);

  const recipientValue = recipientAccountName
    ? _.startCase(_.toLower(recipientAccountName))
    : "--";

  const handleFeesHelpPress = useCallback(() => {
    Alert.alert(
      "Fees",
      "This is the estimated network and processing fee for your swap.",
    );
  }, []);

  const handleSwap = useCallback(async () => {
    if (
      !amount ||
      !fromAssetSymbol ||
      !fromChainKey ||
      !toFiatCode ||
      !recipientInstitutionCode ||
      !recipientAccountNumber
    ) {
      Alert.alert(
        "Missing transaction details",
        "Please go back and complete the swap details before continuing.",
      );
      return;
    }

    try {
      const response = await createSenderOrder({
        amount,
        token: fromAssetSymbol,
        network: fromChainKey,
        fiatCurrency: toFiatCode,
        institution: recipientInstitutionCode,
        accountIdentifier: recipientAccountNumber,
        refundAddress: wallets?.[0]?.address,
        accountName: recipientAccountName,
        memo,
        rate,
      });

      const orderId = response.data?.id;
      if (!orderId) {
        Alert.alert(
          "Swap submitted",
          response.message || "Your swap order has been created successfully.",
        );
        return;
      }

      router.push({
        pathname: "/(home)/transactionProgress",
        params: {
          amount,
          token: fromAssetSymbol,
          recipientName: recipientAccountName ?? "",
          orderId,
          network: fromChainKey,
        },
      });
    } catch (error: unknown) {
      Alert.alert(
        "Swap failed",
        error instanceof Error
          ? error.message
          : "Failed to create swap order. Please try again.",
      );
    }
  }, [
    amount,
    createSenderOrder,
    fromAssetSymbol,
    fromChainKey,
    memo,
    rate,
    recipientAccountName,
    recipientAccountNumber,
    recipientInstitutionCode,
    toFiatCode,
    wallets,
  ]);

  return (
    <AppLayout
      scrollable={false}
      horizontalPadding={false}
      bottomPadding={false}
      statusBarBackgroundColor={colors.canvas_background}
      layoutStyle={{ backgroundColor: colors.canvas_background }}
      directChild
    >
      <View style={{ flex: 1, backgroundColor: colors.canvas_background }}>
        <View style={{ paddingTop: 8, paddingHorizontal: 16 }}>
          <SwapFlowStepper
            activeLabel="Review"
            leadingDots={2}
            showActions
            onWalletPress={() => router.push("/(tabs)/wallet")}
            onClosePress={() => router.navigate("/(tabs)")}
          />
        </View>

        <SwapScreenSheet style={{ flex: 1, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: "100%",
                maxWidth: contentMaxWidth,
                alignSelf: "center",
                gap: 24,
              }}
            >
              <SwapChainRow
                title="Swap"
                chainName={fromChainName}
                chainLogoUri={fromChainLogoUri}
                isStatic
                showChevron={false}
                marginTop={0}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                style={{ alignSelf: "flex-start" }}
              >
                <BackArrow />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: hp(3.5),
                width: "100%",
                maxWidth: detailsMaxWidth,
                alignSelf: "center",
                gap: 24,
              }}
            >
              <View style={{ gap: 8 }}>
                <ResponsiveUi.Text medium fontSize={20} color={colors.text}>
                  Review transaction
                </ResponsiveUi.Text>
                <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
                  Verify transaction details before you send
                </ResponsiveUi.Text>
              </View>

              <View style={{ gap: 16 }}>
                <DetailRow
                  label="Amount"
                  value={amountValue}
                  valueIconSymbol={fromAssetSymbol}
                  valueIconUri={fromAssetUri}
                />
                <DetailRow
                  label="Fees"
                  value={feeValue}
                  showHelpIcon
                  onHelpPress={handleFeesHelpPress}
                />
                <DetailRow
                  label="Total value"
                  value={totalFiatValue}
                  valueIconUri={toFiatUri}
                />
                <DetailRow label="Recipient" value={recipientValue} />
                {recipientAccountNumber && recipientInstitutionName ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
                      Account
                    </ResponsiveUi.Text>
                    <AccountValue
                      accountNumber={recipientAccountNumber}
                      bankName={recipientInstitutionName}
                    />
                  </View>
                ) : (
                  <DetailRow label="Account" value="--" />
                )}
                <DetailRow label="Memo" value={memoValue} />
              </View>
            </View>

            <ResponsiveUi.Text
              center
              fontSize={14}
              color={colors.secondary}
              style={{
                marginTop: "auto",
                paddingTop: hp(4),
                paddingHorizontal: wp(4),
                lineHeight: 20,
                maxWidth: 279,
                alignSelf: "center",
              }}
            >
              Ensure the details above is correct. Failed transaction due to wrong
              details will attract a refund fee
            </ResponsiveUi.Text>

            <View
              style={{
                paddingTop: 24,
                paddingBottom: Math.max(insets.bottom, 16),
                width: "100%",
                maxWidth: contentMaxWidth,
                alignSelf: "center",
              }}
            >
              <ResponsiveUi.Button
                action={handleSwap}
                title={isCreatingOrder ? "Submitting..." : "Swap"}
                disabled={isCreatingOrder}
                backgroundColor={colors.slate}
                semiBold
                fontSize={18}
                style={{ width: "100%", height: 52, borderRadius: 50 }}
              />
            </View>
          </View>
        </SwapScreenSheet>
      </View>
    </AppLayout>
  );
};

export default ReviewTransaction;
