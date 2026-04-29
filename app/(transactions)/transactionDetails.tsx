import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import React, { FunctionComponent, memo } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { ITransaction } from "@/utils/sampleData";
import USDC from "@/components/svgs/usdc-icon";
import Tether from "@/components/svgs/tether";
import Binance from "@/components/svgs/binance";
import { formatAmount, setTransactionStatusColor } from "@/utils/general";
import { useThemeColors } from "@/hooks/useThemeColor";
import _ from "lodash";
import * as WebBrowser from "expo-web-browser";

type TransactionDetailsParams = Omit<ITransaction, "icon"> & { icon?: string };

const iconMap = {
  USDC,
  Tether,
  Binance,
};

const TransactionItem: FunctionComponent<{
  label: string;
  field: string;
  type?: "status" | "link";
  link?: string;
}> = memo(({ label, field, type, link }) => {
  const colors = useThemeColors();
  const statusColor =
    type === "status" ? setTransactionStatusColor(field) : undefined;
  const labelColor =
    type === "link"
      ? colors.primary
      : type === "status"
        ? statusColor
        : colors.text;

  const openWebsite = async () => {
    if (link) {
      await WebBrowser.openBrowserAsync(link);
    }
  };
  return (
    <View className="flex-row mb-6 justify-between items-center">
      <ResponsiveUi.Text
        medium
        fontSize={16}
        color={colors.secondary}
        tailwind=""
      >
        {label}
      </ResponsiveUi.Text>
      <ResponsiveUi.Text
        onPress={openWebsite}
        light
        fontSize={14}
        color={labelColor}
      >
        {field}
      </ResponsiveUi.Text>
    </View>
  );
});

const TransactionDetails: FunctionComponent = () => {
  const params = useLocalSearchParams() as unknown as TransactionDetailsParams;
  const Icon = params.token
    ? iconMap[params.token as keyof typeof iconMap]
    : undefined;
  return (
    <AppLayout>
      <View style={{ alignItems: "center", marginTop: 32 }}>
        <ResponsiveUi.Text medium center fontSize={20}>
          Swapped
        </ResponsiveUi.Text>
        <View className="mt-8 items-center">
          <ResponsiveUi.Text medium fontSize={36}>
            {formatAmount(params.amountUSD, "$")}
          </ResponsiveUi.Text>
          <View className="mt-4 flex-row items-center justify-center">
            {Icon && <Icon width={24} height={24} />}
            <ResponsiveUi.Text medium center fontSize={18} tailwind="ml-2">
              {params.amountUSD} {params.token}
            </ResponsiveUi.Text>
          </View>
        </View>
        <View className="mt-12 w-full">
          <TransactionItem
            label="Amount"
            field={formatAmount(params.amountNGN, "₦")}
          />
          <TransactionItem
            label="Recipient"
            field={_.truncate("Franscesca Tobiloba", {
              length: 20,
              omission: "...",
            })}
          />
          <TransactionItem label="Bank" field={"First Bank of Nigeria"} />
          <TransactionItem label="Account" field={"1234567890"} />
          <TransactionItem
            label="Memo"
            field={_.truncate("From me, Donda North", {
              length: 20,
              omission: "...",
            })}
          />
        </View>
        <View className="mt-12 w-full">
          <TransactionItem label="Date" field={params.date} />
          <TransactionItem
            label="Transaction Status"
            field={params.status}
            type="status"
          />
          <TransactionItem label="Fund status" field={"Deposited"} />
          <TransactionItem label="Time spent" field={"12 seconds"} />
          <TransactionItem
            label="Onchain receipt"
            field={"View in explorer"}
            type="link"
            link="https://www.blockchain.com/explorer"
          />
        </View>
        <ResponsiveUi.Button
          className="mt-4"
          title="Get receipt"
          action={() => {}}
        />
      </View>
    </AppLayout>
  );
};

export default TransactionDetails;
