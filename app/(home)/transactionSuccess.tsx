import TransactionFlowRow from "@/components/cards/TransactionFlowRow";
import AppLayout from "@/components/layouts/AppLayout";
import BaseSheet from "@/components/modals/BottomSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import HeartIcon from "@/components/svgs/heart-icon";
import WarpcastIcon from "@/components/svgs/warpcast-icon";
import XIcon from "@/components/svgs/x-icon";
import { useThemeColors } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import { CheckCircle2, X } from "lucide-react-native";
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
      <ResponsiveUi.Text fontSize={14} color={valueColor} bold={valueBold}>
        {value}
      </ResponsiveUi.Text>
    </View>
  );
};

const TransactionSuccess: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
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

    return "20.4 USDT";
  }, [amount, token]);

  const recipientLabel = useMemo(() => {
    const trimmed = recipientName?.trim();
    return _.startCase(_.toLower(trimmed || "Chukwuemeka"));
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
      <View className="flex-1">
        <View
          style={{
            backgroundColor: "#39C65D",
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
              <CheckCircle2 color={colors.teal} size={30} />
              <ResponsiveUi.Text
                fontSize={20}
                bold
                tailwind="mt-5"
                color={colors.text}
              >
                Transaction successful
              </ResponsiveUi.Text>
            </View>

            <TransactionFlowRow
              amountLabel={amountLabel}
              tokenInitial={tokenInitial}
              recipientLabel={recipientLabel}
              colors={{
                teal: colors.teal,
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
              to {recipientLabel} has been completed successfully.
            </ResponsiveUi.Text>

            <View
              className="mt-5"
              style={{ borderTopWidth: 1, borderTopColor: colors.gray }}
            />

            <View className="mt-5" style={{ gap: 16 }}>
              <DetailRow
                label="Transaction status"
                value="Completed"
                labelColor={colors.secondary}
                valueColor={colors.success}
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

            <View
              className="mt-5"
              style={{ borderTopWidth: 1, borderTopColor: colors.gray }}
            />

            <ResponsiveUi.Text
              fontSize={14}
              tailwind="mt-5"
              color={colors.secondary}
            >
              Help spread the word
            </ResponsiveUi.Text>

            <View className="mt-4 rounded-2xl px-4 py-4 flex-row items-start">
              <HeartIcon width={26} height={26} />
              <ResponsiveUi.Text
                fontSize={14}
                tailwind="ml-3 flex-1"
                color={colors.secondary}
              >
                Yay! I just sent crypto to a bank account in 12 sec on
                noblocks.xyz
              </ResponsiveUi.Text>
            </View>

            <View className="w-[80%] pt-6 flex-row" style={{ gap: 14 }}>
              <ResponsiveUi.Button
                title="X (Twitter)"
                action={() => {}}
                bold
                color={colors.text}
                backgroundColor={colors.subtle_surface}
                iconLeft={<XIcon width={16} height={16} />}
                style={{ width: "50%", height: 40 }}
                tailwind="w-full ml-8"
              />
              <ResponsiveUi.Button
                title="Warpcast"
                action={() => {}}
                bold
                color={colors.text}
                backgroundColor={colors.subtle_surface}
                iconLeft={<WarpcastIcon width={16} height={16} />}
                style={{ width: "48%", height: 40 }}
                tailwind="w-full ml-8"
              />
            </View>

            <View className="mt-auto pt-6 flex-row" style={{ gap: 14 }}>
              <ResponsiveUi.Button
                title="Get receipt"
                action={() => {}}
                bold
                color={colors.text}
                backgroundColor={colors.subtle_surface}
                style={{ flex: 1 }}
                tailwind="w-full"
              />
              <ResponsiveUi.Button
                title="New payment"
                action={() => {}}
                bold
                color={colors.white}
                backgroundColor={colors.slate}
                style={{ flex: 1, width: "100%" }}
                tailwind="w-full"
              />
            </View>
          </View>
        </BaseSheet>
      </View>
    </AppLayout>
  );
};

export default TransactionSuccess;
