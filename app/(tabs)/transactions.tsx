import React, { FunctionComponent } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import {
  SectionList,
  ListRenderItem,
  View,
  TouchableOpacity,
} from "react-native";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { ITransaction, transactions } from "@/utils/sampleData";
import { Colors } from "@/constants/Colors";
import { formatAmount, setTransactionStatusColor } from "@/utils/general";
import Coins from "@/components/svgs/coins";
import { ActivityIndicator } from "react-native-paper";
import { isToday, isYesterday, format, parseISO } from "date-fns";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";

type TransactionDetailsParams = Omit<ITransaction, "icon"> & { icon?: string };

const transactionItem: ListRenderItem<ITransaction> = ({ item }) => {
  const { icon: Icon, amountNGN, amountUSD, status, token } = item;
  const statusColor = setTransactionStatusColor(status);
  const router = useRouter(); // Moved this line up for clarity
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(transactions)/transactionDetails",
          params: { ...item } as unknown as TransactionDetailsParams, // Type assertion to ensure params match expected type
        })
      }
      className="flex-row items-center justify-between py-4 px-2"
    >
      <View className="flex-row items-center">
        <Icon width={40} height={40} />
        <View className="ml-2">
          <View className="flex-row items-center">
            {status === "Completed" ? (
              <Coins />
            ) : (
              <ActivityIndicator size={10} />
            )}
            <ResponsiveUi.Text
              color={Colors.light.secondary}
              tailwind="ml-2"
              fontSize={14}
            >
              {status === "Completed" ? "Swapped" : "Swapping"}
            </ResponsiveUi.Text>
          </View>
          <ResponsiveUi.Text fontSize={14} tailwind="mt-1">
            {formatAmount(amountUSD, "$")} {token}
          </ResponsiveUi.Text>
        </View>
      </View>
      <View className="flex-col items-end">
        <ResponsiveUi.Text
          medium
          fontSize={16}
          tailwind="ml-2"
          color={Colors.light.secondary}
        >
          {formatAmount(amountNGN, "NGN ")}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          light
          fontSize={14}
          color={statusColor}
          tailwind="ml-2  mt-1"
        >
          {status}
        </ResponsiveUi.Text>
      </View>
    </TouchableOpacity>
  );
};

// Helper to get section title
function getSectionTitle(dateString: string) {
  const date = parseISO(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

// Group transactions by section
function groupTransactionsByDay(transactions: ITransaction[]) {
  const groups: { [key: string]: ITransaction[] } = {};
  transactions.forEach((tx) => {
    const section = getSectionTitle(tx.date);
    if (!groups[section]) groups[section] = [];
    groups[section].push(tx);
  });
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

const Transactions: FunctionComponent = () => {
  const sections = groupTransactionsByDay(transactions);
  const colors = useThemeColors();
  return (
    <AppLayout scrollable={false}>
      <View className="mt-4 mb-24">
        <ResponsiveUi.Text medium fontSize={22} tailwind="mb-2">
          Transactions
        </ResponsiveUi.Text>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={sections}
          renderItem={transactionItem}
          keyExtractor={(item, index) => index.toString()}
          className="mt-4"
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                backgroundColor: colors.background,
                zIndex: 10,
                paddingVertical: 8,
                paddingHorizontal: 8,
              }}
            >
              <ResponsiveUi.Text
                fontSize={16}
                medium
                color={Colors.light.secondary}
              >
                {title}
              </ResponsiveUi.Text>
            </View>
          )}
          stickySectionHeadersEnabled={true}
        />
      </View>
    </AppLayout>
  );
};

export default Transactions;
