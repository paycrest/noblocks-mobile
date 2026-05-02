import React, { FunctionComponent } from "react";
import { useAppDimensions } from "@/hooks/useAppDimensions";

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

const transactionItem =
  (hp: any, wp: any): ListRenderItem<ITransaction> =>
  ({ item }) => {
    const { icon: Icon, amountNGN, amountUSD, status, token } = item;
    const statusColor = setTransactionStatusColor(status);
    const router = useRouter();
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(transactions)/transactionDetails",
            params: { ...item } as unknown as TransactionDetailsParams,
          })
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: hp(1.2),
          paddingHorizontal: wp(2),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon width={wp(9)} height={wp(9)} />
          <View style={{ marginLeft: wp(2) }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {status === "Completed" ? (
                <Coins width={wp(4)} height={wp(4)} />
              ) : (
                <ActivityIndicator size={wp(2.5)} />
              )}
              <ResponsiveUi.Text
                color={Colors.light.secondary}
                style={{ marginLeft: wp(2) }}
                fontSize={wp(3.5)}
              >
                {status === "Completed" ? "Swapped" : "Swapping"}
              </ResponsiveUi.Text>
            </View>
            <ResponsiveUi.Text fontSize={wp(3)} style={{ marginTop: hp(0.5) }}>
              {formatAmount(amountUSD, "$")} {token}
            </ResponsiveUi.Text>
          </View>
        </View>
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <ResponsiveUi.Text
            medium
            fontSize={wp(3.8)}
            style={{ marginLeft: wp(2) }}
            color={Colors.light.secondary}
          >
            {formatAmount(amountNGN, "NGN ")}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            light
            fontSize={wp(3)}
            color={statusColor}
            style={{ marginLeft: wp(2), marginTop: hp(0.5) }}
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
  const { hp, wp } = useAppDimensions();
  const sections = groupTransactionsByDay(transactions);
  const colors = useThemeColors();
  return (
    <AppLayout scrollable={false}>
      <View style={{ marginTop: hp(3.5), marginBottom: hp(10) }}>
        <ResponsiveUi.Text
          medium
          fontSize={wp(4.8)}
          style={{ marginBottom: hp(1.2) }}
        >
          Transactions
        </ResponsiveUi.Text>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={sections}
          renderItem={transactionItem(hp, wp)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ marginTop: hp(2) }}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                backgroundColor: colors.background,
                zIndex: 10,
                paddingVertical: hp(1),
                paddingHorizontal: wp(2),
              }}
            >
              <ResponsiveUi.Text
                fontSize={wp(3.5)}
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
