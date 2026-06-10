import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import React, { FunctionComponent, memo } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { formatAmount, formatAmountLabel, setTransactionStatusColor } from "@/utils/general";
import { useThemeColors } from "@/hooks/useThemeColor";
import _ from "lodash";
import { getTransactionTokenIcon } from "@/lib/transactions/icons";
import { format, parseISO } from "date-fns";

type TransactionDetailsParams = {
  id?: string;
  amountUSD?: string;
  amountFiat?: string;
  fiatCurrency?: string;
  status?: string;
  date?: string;
  token?: string;
  recipientName?: string;
  institutionName?: string;
  accountNumber?: string;
  memo?: string;
};

const TransactionItem: FunctionComponent<{
  label: string;
  field: string;
  type?: "status" | "link";
  link?: string;
}> = memo(({ label, field, type }) => {
  const colors = useThemeColors();
  const statusColor =
    type === "status" ? setTransactionStatusColor(field) : undefined;
  const labelColor =
    type === "status" ? statusColor : colors.text;

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
      <ResponsiveUi.Text light fontSize={14} color={labelColor}>
        {field}
      </ResponsiveUi.Text>
    </View>
  );
});

const TransactionDetails: FunctionComponent = () => {
  const params = useLocalSearchParams<TransactionDetailsParams>();
  const token = params.token?.trim().toUpperCase() ?? "USDC";
  const Icon = getTransactionTokenIcon(token);
  const amountUSD = Number.parseFloat(params.amountUSD ?? "0");
  const amountFiat = Number.parseFloat(params.amountFiat ?? "0");
  const fiatCurrency = params.fiatCurrency?.trim().toUpperCase() ?? "NGN";
  const status = params.status ?? "Ongoing";
  const formattedDate = params.date
    ? format(parseISO(params.date), "MMM d, yyyy · h:mm a")
    : "--";
  const recipientName = params.recipientName?.trim()
    ? _.startCase(_.toLower(params.recipientName.trim()))
    : "--";
  const institutionName = params.institutionName?.trim() || "--";
  const accountNumber = params.accountNumber?.trim() || "--";
  const memo = params.memo?.trim() || "No memo";

  return (
    <AppLayout canGoBack>
      <View style={{ alignItems: "center", marginTop: 32 }}>
        <ResponsiveUi.Text medium center fontSize={20}>
          Swapped
        </ResponsiveUi.Text>
        <View className="mt-8 items-center">
          <ResponsiveUi.Text medium fontSize={36}>
            {formatAmount(amountUSD, "$")}
          </ResponsiveUi.Text>
          <View className="mt-4 flex-row items-center justify-center">
            <Icon width={24} height={24} />
            <ResponsiveUi.Text medium center fontSize={18} tailwind="ml-2">
              {formatAmountLabel(String(amountUSD), token)}
            </ResponsiveUi.Text>
          </View>
        </View>
        <View className="mt-10 w-full">
          <TransactionItem
            label="Amount"
            field={formatAmount(amountFiat, `${fiatCurrency} `)}
          />
          <TransactionItem
            label="Recipient"
            field={_.truncate(recipientName, {
              length: 20,
              omission: "...",
            })}
          />
          <TransactionItem label="Bank" field={institutionName} />
          <TransactionItem label="Account" field={accountNumber} />
          <TransactionItem
            label="Memo"
            field={_.truncate(memo, {
              length: 20,
              omission: "...",
            })}
          />
        </View>
        <View className="border border-gray border-dashed w-full my-2" />
        <View className="mt-6 w-full">
          <TransactionItem label="Date" field={formattedDate} />
          <TransactionItem
            label="Transaction Status"
            field={status}
            type="status"
          />
          {params.id ? (
            <TransactionItem label="Order ID" field={params.id} />
          ) : null}
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
