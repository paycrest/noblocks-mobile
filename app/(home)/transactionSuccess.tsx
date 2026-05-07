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
    <View className="flex-row items-center mt-2 justify-between">
      <ResponsiveUi.Text fontSize={hp(1.8)} color={labelColor}>
        {label}
      </ResponsiveUi.Text>
      <ResponsiveUi.Text fontSize={hp(1.8)} color={valueColor} bold={valueBold}>
        {value}
      </ResponsiveUi.Text>
    </View>
  );
};

const TransactionSuccess: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { hp } = useAppDimensions();
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
            bottom: 0,
          }}
        />

        <BaseSheet
          isVisible
          snapPoints={["92%"]}
          topCornerRadius={50}
          isDismissible={false}
          showBackdrop={false}
          hideHandle
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: hp(2.5),
              paddingTop: hp(2),
              paddingBottom: Math.max(insets.bottom, hp(1.2)),
              borderTopRightRadius: 50,
              borderTopLeftRadius: 50,
            }}
          >
            <View className="items-end">
              <X size={28} color={colors.text} onPress={() => router.back()} />
            </View>

            <View style={{ marginTop: hp(1), alignItems: "flex-start" }}>
              <CheckCircle2 color={colors.teal} size={hp(4)} />
              <ResponsiveUi.Text
                fontSize={hp(2)}
                bold
                style={{ marginTop: hp(1.2) }}
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
              style={{
                marginTop: hp(1.5),
                borderTopWidth: 1,
                borderTopColor: colors.gray,
              }}
            />

            <ResponsiveUi.Text
              fontSize={hp(1.7)}
              style={{ marginTop: hp(1.2) }}
              lineHeight={5}
              color={colors.secondary}
            >
              Your transfer of{" "}
              <ResponsiveUi.Text color={colors.text} fontSize={hp(2)} medium>
                {amountLabel}
              </ResponsiveUi.Text>{" "}
              to {recipientLabel} has been completed successfully.
            </ResponsiveUi.Text>

            <View
              style={{
                marginTop: hp(5),
                borderTopWidth: 1,
                borderTopColor: colors.gray,
              }}
            />

            <View style={{ marginTop: hp(1.2), gap: hp(1.2) }}>
              <DetailRow
                label="Transaction status"
                value="Completed"
                labelColor={colors.secondary}
                valueColor={colors.success}
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
              style={{
                marginTop: hp(2.5),
                borderTopWidth: 1,
                borderTopColor: colors.gray,
              }}
            />

            <ResponsiveUi.Text
              fontSize={hp(2)}
              style={{ marginTop: hp(2) }}
              color={colors.secondary}
            >
              Help spread the word
            </ResponsiveUi.Text>

            <View
              style={{
                marginTop: hp(3),
                borderRadius: hp(1.2),
                paddingHorizontal: hp(1.2),
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <HeartIcon width={26} height={26} />
              <ResponsiveUi.Text
                fontSize={hp(1.5)}
                tailwind="ml-3 flex-1"
                color={colors.secondary}
              >
                Yay! I just sent crypto to a bank account in 12 sec on
                noblocks.xyz
              </ResponsiveUi.Text>
            </View>

            <View
              style={{
                paddingTop: hp(1.5),
                flexDirection: "row",
                gap: hp(1),
              }}
            >
              <ResponsiveUi.Button
                title="X (Twitter)"
                action={() => {}}
                bold
                color={colors.text}
                backgroundColor={colors.subtle_surface}
                iconLeft={<XIcon width={16} height={16} />}
                style={{ flex: 1, height: 44 }}
              />
              <ResponsiveUi.Button
                title="Warpcast"
                action={() => {}}
                bold
                color={colors.text}
                backgroundColor={colors.subtle_surface}
                iconLeft={<WarpcastIcon width={16} height={16} />}
                style={{ flex: 1, height: 44 }}
              />
            </View>

            <View
              style={{
                marginTop: "auto",
                paddingTop: hp(1.5),
                flexDirection: "row",
                gap: hp(1),
              }}
            >
              <ResponsiveUi.Button
                title="Get receipt"
                action={() => {}}
                bold
                color={colors.text}
                backgroundColor={colors.subtle_surface}
                style={{ flex: 1, minHeight: hp(5.5) }}
                tailwind="w-full"
              />
              <ResponsiveUi.Button
                title="New payment"
                action={() =>
                  router.push({
                    pathname: "/(home)/transactionFailed",
                    params: {
                      amount: amount?.trim() ?? "",
                      token: token?.trim() ?? "",
                      recipientName: recipientName?.trim() ?? "",
                      failureReason:
                        "The node was acting up and we couldn’t get it to concentrate on the transaction. So sorry man!",
                    },
                  })
                }
                bold
                color={colors.white}
                backgroundColor={colors.slate}
                style={{ flex: 1, minHeight: hp(5.5), width: "100%" }}
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
