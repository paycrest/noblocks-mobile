import { createPaycrestSenderOrder } from "@/api/queryFns";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { WalletIcon, X } from "lucide-react-native";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Alert, View } from "react-native";

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

  return (
    <View className="flex-row items-start justify-between py-3">
      <ResponsiveUi.Text fontSize={14} color={colors.secondary}>
        {label}
      </ResponsiveUi.Text>
      <View className="flex-row items-center max-w-[62%]">
        {valueIconUri ? (
          <Image
            source={{ uri: valueIconUri }}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              marginRight: 6,
            }}
            contentFit="cover"
          />
        ) : null}
        <ResponsiveUi.Text
          fontSize={12}
          medium
          color={colors.text}
          tailwind="text-right"
        >
          {value}
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

const ReviewTransaction: FunctionComponent = () => {
  const colors = useThemeColors();
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
      <View className="flex-row items-center justify-between ">
        <View className="flex-row w-1/3 justify-between items-center">
          <View className="border rounded-full w-3 h-3 border-primary" />
          <View className="border rounded-full w-3 h-3 border-primary" />
          <ResponsiveUi.Text fontSize={14} bold color={colors.primary}>
            Review
          </ResponsiveUi.Text>
        </View>
        <View className="flex-row items-center  ">
          <WalletIcon className="mr-8" />
          <X color={colors.secondary} onPress={() => router.back()} />
        </View>
      </View>
      <View className="flex-row mt-8 items-center justify-between">
        <ResponsiveUi.Text className="mt-4" semiBold fontSize={18}>
          Swap
        </ResponsiveUi.Text>
        <View className="flex-row items-center">
          {fromChainLogoUri ? (
            <Image
              source={{ uri: fromChainLogoUri }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                marginRight: 8,
              }}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text medium className="ml-4" fontSize={18}>
            {fromChainName}
          </ResponsiveUi.Text>
        </View>
      </View>
      <View className="mt-12 items-start">
        <ResponsiveUi.Text fontSize={18} medium color={colors.text}>
          Review Transaction
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          tailwind="mt-4"
          fontSize={16}
          color={colors.secondary}
        >
          Verify transaction details before you send
        </ResponsiveUi.Text>
      </View>
      <View
        className="mt-8 rounded-2xl border px-4 py-2"
        style={{ borderColor: colors.gray }}
      >
        <DetailRow
          label="Amount (token)"
          value={amountValue}
          valueIconUri={fromAssetUri}
        />
        <DetailRow label="Fees" value={feeValue} />
        <DetailRow label="Total Value (fiat)" value={totalFiatValue} />
        <DetailRow label="Recipient" value={recipientValue} />
        <DetailRow label="Account" value={accountValue} />
        <DetailRow label="Memo" value={memoValue} />
      </View>
      <View className="mt-12 px-8 justify-center items-center">
        <ResponsiveUi.Text
          center
          tailwind="leading-6"
          fontSize={14}
          color={colors.secondary}
        >
          Ensure the details above is correct. Failed transaction due to wrong
          details will attract a refund fee
        </ResponsiveUi.Text>
      </View>
      <View className="flex-1 justify-end">
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
        />
      </View>
    </AppLayout>
  );
};

export default ReviewTransaction;
