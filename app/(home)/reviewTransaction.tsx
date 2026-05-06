import { createPaycrestSenderOrder } from "@/api/queryFns";
import SwapChainRow from "@/components/cards/SwapChainRow";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import _ from "lodash";
import { X } from "lucide-react-native";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Alert, View } from "react-native";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import BackArrow from "@/components/svgs/back-arrow";
import WalletIcon from "@/components/svgs/wallet";

interface DetailRowProps {
  label: string;
  value: string;
  valueIconUri?: string;
}

const DetailRow: FunctionComponent<DetailRowProps> = ({
  label,
  value,
  valueIconUri,
}) => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingVertical: hp(1.2),
      }}
    >
      <ResponsiveUi.Text fontSize={hp(2)} color={colors.secondary}>
        {label}
      </ResponsiveUi.Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", maxWidth: "62%" }}
      >
        {valueIconUri ? (
          <Image
            source={{ uri: valueIconUri }}
            style={{
              width: wp(4.5),
              height: wp(4.5),
              borderRadius: wp(2.25),
              marginRight: wp(1.5),
            }}
            contentFit="cover"
          />
        ) : null}
        <ResponsiveUi.Text
          fontSize={hp(1.8)}
          medium
          color={colors.text}
          style={{ textAlign: "right" }}
        >
          {value}
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

const ReviewTransaction: FunctionComponent = () => {
  const colors = useThemeColors();
  const { hp, wp } = useAppDimensions();
  const { wallets } = useEmbeddedEthereumWallet();
  const {
    amount,
    fromChainKey,
    fromChainName,
    fromChainLogoUri,
    fromAssetSymbol,
    fromAssetUri,
    toFiatCode,
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

  const amountValue = useMemo(() => {
    if (!amount) {
      return "--";
    }

    return fromAssetSymbol ? `${amount} ${fromAssetSymbol}` : amount;
  }, [amount, fromAssetSymbol]);

  const feeValue = useMemo(() => {
    if (fee) {
      return fromAssetSymbol ? `${fee} ${fromAssetSymbol}` : fee;
    }

    return fromAssetSymbol ? `0 ${fromAssetSymbol}` : "0";
  }, [fee, fromAssetSymbol]);

  const totalFiatValue = useMemo(() => {
    if (!fiatEstimate) {
      return "--";
    }

    return toFiatCode ? `${toFiatCode} ${fiatEstimate}` : fiatEstimate;
  }, [fiatEstimate, toFiatCode]);

  const accountValue = useMemo(() => {
    if (recipientAccountNumber && recipientInstitutionName) {
      return `${recipientAccountNumber} • ${recipientInstitutionName}`;
    }

    if (recipientAccountNumber) {
      return recipientAccountNumber;
    }

    return "--";
  }, [recipientAccountNumber, recipientInstitutionName]);

  const memoValue = useMemo(() => {
    const sanitizedMemo = memo?.trim();
    return sanitizedMemo ? sanitizedMemo : "No memo";
  }, [memo]);

  const recipientValue = recipientAccountName || "--";

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

      Alert.alert(
        "Swap submitted",
        response.message || "Your swap order has been created successfully.",
      );
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
    <AppLayout>
      {/* Progress Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "45%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: wp(3) / 2,
              width: wp(3),
              height: wp(3),
              borderColor: colors.primary,
            }}
          />
          <View
            style={{
              borderWidth: 1,
              borderRadius: wp(3) / 2,
              width: wp(3),
              height: wp(3),
              borderColor: colors.primary,
            }}
          />
          <View
            style={{
              backgroundColor: colors.primary_2,
              borderRadius: 16,
              paddingVertical: 4,
              paddingHorizontal: 12,
              marginHorizontal: 5,
            }}
          >
            <ResponsiveUi.Text medium color={colors.primary} fontSize={hp(2.3)}>
              Review
            </ResponsiveUi.Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <WalletIcon style={{ marginRight: wp(4) }} />
          <X color={colors.secondary} onPress={() => router.back()} />
        </View>
      </View>
      <SwapChainRow
        title="Swap"
        chainName={fromChainName}
        chainLogoUri={fromChainLogoUri}
        isStatic
        showChevron={false}
        marginTop={hp(2.5)}
      />
      <BackArrow className="mt-4 -ml-2" onPress={() => router.back()} />
      {/* Title and Subtitle */}
      <View
        style={{
          marginTop: hp(5),
          marginHorizontal: wp(4),
          alignItems: "flex-start",
        }}
      >
        <ResponsiveUi.Text fontSize={hp(2.2)} medium color={colors.text}>
          Review Transaction
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          style={{ marginTop: hp(1.5) }}
          fontSize={hp(2)}
          color={colors.secondary}
        >
          Verify transaction details before you send
        </ResponsiveUi.Text>
      </View>
      {/* Details Card */}
      <View
        style={{
          marginTop: hp(2.5),
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.gray,
          paddingHorizontal: wp(4),
          paddingVertical: hp(1.5),
        }}
      >
        <DetailRow
          label="Amount (token)"
          value={amountValue}
          valueIconUri={fromAssetUri}
        />
        <DetailRow label="Fees" value={feeValue} />
        <DetailRow label="Total Value (fiat)" value={totalFiatValue} />
        <DetailRow
          label="Recipient"
          value={_.startCase(_.toLower(recipientAccountName))}
        />
        <DetailRow label="Account" value={accountValue} />
        <DetailRow label="Memo" value={memoValue} />
      </View>
      <View
        style={{
          marginTop: hp(3),
          paddingHorizontal: wp(6),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ResponsiveUi.Text
          center
          style={{ lineHeight: hp(2) }}
          fontSize={hp(1.8)}
          color={colors.secondary}
        >
          Ensure the details above is correct. Failed transaction due to wrong
          details will attract a refund fee
        </ResponsiveUi.Text>
      </View>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 15,
          paddingHorizontal: wp(4),
        }}
      >
        <ResponsiveUi.Button
          action={() => {
            // handleSwap();
            router.push({
              pathname: "/(home)/transactionProgress",
              params: {
                amount: amount ?? "",
                token: fromAssetSymbol ?? "",
                recipientName: recipientAccountName ?? "",
              },
            });
          }}
          title={isCreatingOrder ? "Submitting..." : "Swap"}
          disabled={isCreatingOrder}
          style={{ width: "100%" }}
          fontSize={hp(2)}
        />
      </View>
    </AppLayout>
  );
};

export default ReviewTransaction;
