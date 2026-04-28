import React, { FunctionComponent } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import { FlatList, ListRenderItem, View } from "react-native";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import USDC from "@/components/svgs/usdc-icon";
import Tether from "@/components/svgs/tether";
import Binance from "@/components/svgs/binance";
import { Colors, colors } from "../../constants/Colors";
import DepositModal from "@/components/modals/DepositModal";
import { formatWalletAddress } from "@privy-io/expo";

const sampleWalletData = [
  {
    symbol: "USDC",
    balance: 47.48,
    icon: USDC,
    name: "USD Coin",
    pctChange: 2.5,
  },
  {
    symbol: "USDT",
    balance: 0.5,
    icon: Tether,
    name: "USD Tether",
    pctChange: -1.2,
  },
  {
    symbol: "BUSD",
    balance: 100,
    icon: Binance,
    name: "Binance USD",
    pctChange: 0.8,
  },
];

const walletItem: ListRenderItem<{
  symbol: string;
  balance: number;
  icon: React.FC<{ width: number; height: number }>;
  name: string;
  pctChange: number;
}> = ({ item }) => {
  const { symbol, balance, icon: Icon, name } = item;

  return (
    <View className="flex-row items-center justify-between py-4 px-2">
      <View className="flex-row items-center">
        <Icon width={40} height={40} />
        <View className="flex-col items-start">
          <ResponsiveUi.Text medium fontSize={16} tailwind="ml-2">
            {name}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            light
            fontSize={14}
            color={Colors.light.secondary}
            tailwind="ml-2 mt-1 text-gray-500"
          >
            {balance} {symbol}
          </ResponsiveUi.Text>
        </View>
      </View>
      <View>
        <ResponsiveUi.Text medium tailwind="text-right" fontSize={16}>
          ${balance}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          light
          fontSize={14}
          color={item.pctChange >= 0 ? Colors.success : Colors.destructive}
          tailwind={`mt-1 text-right`}
        >
          {item.pctChange >= 0 ? "+" : ""}
          {item.pctChange}%
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

const Wallet: FunctionComponent = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <AppLayout scrollable={false}>
      <View className="mt-8">
        <ResponsiveUi.Text medium center fontSize={20}>
          Smart wallet
        </ResponsiveUi.Text>
        <ResponsiveUi.Text medium center fontSize={32} tailwind="mt-6">
          $47.4805
        </ResponsiveUi.Text>
        <View className="flex-row items-center mt-4 justify-center">
          <USDC height={20} width={20} />
          <ResponsiveUi.Text medium center fontSize={15} tailwind="ml-2">
            47.48 USDC
          </ResponsiveUi.Text>
        </View>
        <View className="flex-row mt-12 justify-between">
          <ResponsiveUi.Button
            style={{ width: "45%" }}
            tailwind="w-full text-center"
            title="Withdraw"
            action={() => {}}
          />
          <ResponsiveUi.Button
            style={{ width: "45%" }}
            tailwind="w-full text-center"
            title="Deposit"
            action={() => setIsVisible(true)}
          />
        </View>
        <FlatList
          data={sampleWalletData}
          keyExtractor={(item) => item.symbol}
          renderItem={walletItem}
          contentContainerStyle={{ marginTop: 40 }}
        />
      </View>
      <DepositModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        address={formatWalletAddress(
          "0x323b5d5d8362ac4d310610f63162b77c4e857416",
        )}
      />
    </AppLayout>
  );
};

export default Wallet;
