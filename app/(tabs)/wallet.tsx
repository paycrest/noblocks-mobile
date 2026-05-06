import React, { FunctionComponent } from "react";
import { useAppDimensions } from "@/hooks/useAppDimensions";

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

const walletItem =
  (
    hp: any,
    wp: any,
  ): ListRenderItem<{
    symbol: string;
    balance: number;
    icon: React.FC<{ width: number; height: number }>;
    name: string;
    pctChange: number;
  }> =>
  ({ item }) => {
    const { symbol, balance, icon: Icon, name } = item;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: hp(2.3),
          paddingHorizontal: wp(2),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon width={wp(10)} height={wp(10)} />
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: wp(2),
            }}
          >
            <ResponsiveUi.Text medium fontSize={wp(4.2)}>
              {name}
            </ResponsiveUi.Text>
            <ResponsiveUi.Text
              light
              fontSize={wp(3.5)}
              color={Colors.light.secondary}
              style={{ marginTop: hp(0.5) }}
            >
              {balance} {symbol}
            </ResponsiveUi.Text>
          </View>
        </View>
        <View>
          <ResponsiveUi.Text
            medium
            style={{ textAlign: "right" }}
            fontSize={wp(4.2)}
          >
            ${balance}
          </ResponsiveUi.Text>
          <ResponsiveUi.Text
            light
            fontSize={wp(3.5)}
            color={item.pctChange >= 0 ? Colors.success : Colors.destructive}
            style={{ marginTop: hp(0.5), textAlign: "right" }}
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
  const { hp, wp } = useAppDimensions();
  return (
    <AppLayout scrollable={false}>
      <View style={{ marginTop: hp(5) }}>
        <ResponsiveUi.Text medium center fontSize={wp(4)}>
          Smart wallet
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          medium
          center
          fontSize={wp(6)}
          style={{ marginTop: hp(4.5) }}
        >
          $47.4805
        </ResponsiveUi.Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: hp(1.5),
            justifyContent: "center",
          }}
        >
          <USDC height={wp(5)} width={wp(5)} />
          <ResponsiveUi.Text
            medium
            center
            fontSize={wp(3.5)}
            style={{ marginLeft: wp(2) }}
          >
            47.48 USDC
          </ResponsiveUi.Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: hp(4),
            justifyContent: "space-between",
          }}
        >
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
          renderItem={walletItem(hp, wp)}
          contentContainerStyle={{ marginTop: hp(3) }}
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
