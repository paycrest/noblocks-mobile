import React, { FunctionComponent } from "react";
import { useAppDimensions } from "@/hooks/useAppDimensions";

import AppLayout from "@/components/layouts/AppLayout";
import { ActivityIndicator, FlatList, ListRenderItem, View } from "react-native";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import USDC from "@/components/svgs/usdc-icon";
import Tether from "@/components/svgs/tether";
import Binance from "@/components/svgs/binance";
import DepositModal from "@/components/modals/DepositModal";
import { formatWalletAddress } from "@/utils/general";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useAggregatedWalletBalances } from "@/hooks/useAggregatedWalletBalances";
import {
  formatTokenAmount,
} from "@/lib/wallet/balances";
import type { ChainBalanceEntry } from "@/lib/wallet/types";

const TOKEN_ICONS: Record<
  string,
  React.FC<{ width: number; height: number }>
> = {
  USDC,
  USDT: Tether,
  BUSD: Binance,
};

const STABLECOIN_SYMBOLS = new Set(["USDC", "USDT", "DAI", "cUSD", "cNGN"]);

const walletItem =
  (
    hp: (value: number) => number,
    wp: (value: number) => number,
    secondaryColor: string,
  ): ListRenderItem<ChainBalanceEntry> =>
  ({ item }) => {
    const { symbol, balance, name, chainName } = item;
    const Icon = TOKEN_ICONS[symbol];
    const usdValue = STABLECOIN_SYMBOLS.has(symbol) ? balance : null;

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
          {Icon ? (
            <Icon width={wp(10)} height={wp(10)} />
          ) : (
            <View
              style={{
                width: wp(10),
                height: wp(10),
                borderRadius: wp(5),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: secondaryColor + "22",
              }}
            >
              <ResponsiveUi.Text medium fontSize={wp(3.5)}>
                {symbol.slice(0, 3)}
              </ResponsiveUi.Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: wp(2),
            }}
          >
            <ResponsiveUi.Text medium fontSize={wp(4.2)}>
              {name || symbol}
            </ResponsiveUi.Text>
            <ResponsiveUi.Text
              light
              fontSize={wp(3.5)}
              color={secondaryColor}
              style={{ marginTop: hp(0.5) }}
            >
              {formatTokenAmount(balance)} {symbol}
            </ResponsiveUi.Text>
            <ResponsiveUi.Text
              light
              fontSize={wp(3)}
              color={secondaryColor}
              style={{ marginTop: hp(0.3) }}
            >
              {chainName}
            </ResponsiveUi.Text>
          </View>
        </View>
        <View>
          <ResponsiveUi.Text
            medium
            style={{ textAlign: "right" }}
            fontSize={wp(4.2)}
          >
            {usdValue !== null ? `$${formatTokenAmount(usdValue)}` : "--"}
          </ResponsiveUi.Text>
        </View>
      </View>
    );
  };

const Wallet: FunctionComponent = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const { hp, wp } = useAppDimensions();
  const colors = useThemeColors();
  const { walletAddress, balances, isLoading } = useAggregatedWalletBalances();

  const usdTotal = balances?.totalUsd ?? 0;
  const primaryStableSymbol =
    balances?.balances.USDC !== undefined
      ? "USDC"
      : Object.keys(balances?.balances ?? {}).find((symbol) =>
          STABLECOIN_SYMBOLS.has(symbol),
        ) ?? "USDC";
  const primaryStableBalance = balances?.balances[primaryStableSymbol] ?? 0;
  const PrimaryIcon = TOKEN_ICONS[primaryStableSymbol] ?? USDC;
  const tokenRows = balances?.entries ?? [];

  return (
    <AppLayout scrollable={false}>
      <View style={{ marginTop: hp(5) }}>
        <ResponsiveUi.Text medium center fontSize={wp(4)}>
          Smart wallet
        </ResponsiveUi.Text>
        {isLoading && !balances ? (
          <ActivityIndicator style={{ marginTop: hp(6) }} />
        ) : (
          <>
            <ResponsiveUi.Text
              medium
              center
              fontSize={wp(6)}
              style={{ marginTop: hp(4.5) }}
            >
              ${formatTokenAmount(usdTotal)}
            </ResponsiveUi.Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: hp(1.5),
                justifyContent: "center",
              }}
            >
              <PrimaryIcon height={wp(5)} width={wp(5)} />
              <ResponsiveUi.Text
                medium
                center
                fontSize={wp(3.5)}
                style={{ marginLeft: wp(2) }}
              >
                {formatTokenAmount(primaryStableBalance)} {primaryStableSymbol}
              </ResponsiveUi.Text>
            </View>
          </>
        )}
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
          data={tokenRows}
          keyExtractor={(item) => `${item.chainId ?? item.chainName}-${item.symbol}-${item.address}`}
          renderItem={walletItem(hp, wp, colors.secondary)}
          contentContainerStyle={{ marginTop: hp(3) }}
          ListEmptyComponent={
            !isLoading ? (
              <ResponsiveUi.Text center color={colors.secondary}>
                No token balances yet
              </ResponsiveUi.Text>
            ) : null
          }
        />
      </View>
      <DepositModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        address={
          walletAddress ? formatWalletAddress(walletAddress) : "Not connected"
        }
      />
    </AppLayout>
  );
};

export default Wallet;
