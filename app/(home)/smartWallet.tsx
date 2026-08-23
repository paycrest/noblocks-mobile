import IconList from "@/components/iconList";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import QRCodeIcon from "@/components/svgs/qr-code";
import USDC from "@/components/svgs/usdc-icon";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useAggregatedWalletBalances } from "@/hooks/useAggregatedWalletBalances";
import {
  formatTokenAmount,
} from "@/lib/wallet/balances";
import { formatAmount, formatWalletAddress } from "@/utils/general";
import { CircleQuestionMark, Copy } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { Share, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

const TABS = ["QR", "Address"];
type Tab = (typeof TABS)[number];

const SmartWallet: FunctionComponent = () => {
  const colors = useThemeColors();
  const { walletAddress, balances } = useAggregatedWalletBalances();

  const [selectedTab, setSelectedTab] = React.useState(TABS[0]);
  const prevTabRef = React.useRef<Tab>(TABS[0]);

  const handleTabPress = (nextTab: Tab) => {
    if (nextTab === selectedTab) return;
    prevTabRef.current = selectedTab;
    setSelectedTab(nextTab);
  };

  const prevTab = prevTabRef.current;

  const isGoingRight = prevTab === "QR" && selectedTab === "Address";
  const isGoingLeft = prevTab === "Address" && selectedTab === "QR";
  const { hp, wp } = useAppDimensions();

  const enteringAnimation = isGoingRight
    ? SlideInLeft.duration(250)
    : SlideInRight.duration(250);

  const exitingAnimation = isGoingRight
    ? SlideOutLeft.duration(250)
    : SlideOutRight.duration(250);

  const mt6 = hp(2.5);
  const mt12 = hp(5);
  const mt2 = hp(0.8);
  const mt4 = hp(4);
  const mt5 = hp(2);
  const px2 = wp(2);
  const py2 = hp(1);
  const tabButtonFontSize = hp(1.7);
  const tabButtonWidth = wp(40);
  const qrSize = hp(35);

  const usdTotal = balances?.totalUsd ?? 0;
  const usdcBalance = balances?.balances.USDC ?? 0;

  const handleCopyAddress = async () => {
    if (!walletAddress) {
      return;
    }

    await Share.share({ message: walletAddress });
  };

  return (
    <View style={{ marginTop: mt6 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveUi.Text
          medium
          fontSize={hp(2.5)}
          style={{ marginRight: wp(3) }}
        >
          Smart Wallet
        </ResponsiveUi.Text>
        <CircleQuestionMark color={colors.secondary} size={hp(2.5)} />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: mt6,
        }}
      >
        <ResponsiveUi.Text
          bold
          fontSize={hp(4)}
          style={{ textAlign: "center" }}
        >
          {formatAmount(usdTotal, "$")}
        </ResponsiveUi.Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: mt2 }}
        >
          <USDC height={hp(2.5)} width={hp(2.5)} />
          <ResponsiveUi.Text
            medium
            fontSize={hp(2)}
            style={{ marginLeft: wp(2) }}
          >
            {formatTokenAmount(usdcBalance)} USDC
          </ResponsiveUi.Text>
        </View>
      </View>
      <View
        style={{
          marginTop: mt12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveUi.Text>Fund wallet</ResponsiveUi.Text>
        <View
          style={{
            flexDirection: "row",
            width: wp(85),
            paddingHorizontal: px2,
            borderRadius: wp(20),
            justifyContent: "space-between",
            paddingVertical: py2,
            backgroundColor: colors.gray,
            marginTop: mt6,
            alignItems: "center",
          }}
        >
          {TABS.map((tab) => (
            <View
              key={tab}
              style={{ width: tabButtonWidth, alignSelf: "center" }}
            >
              <ResponsiveUi.Button
                title={tab}
                fontSize={tabButtonFontSize}
                backgroundColor={
                  selectedTab === tab ? colors.primary_2 : "transparent"
                }
                color={selectedTab === tab ? colors.lavendar : colors.secondary}
                action={() => handleTabPress(tab)}
                style={{
                  width: wp(40),
                  textAlign: "center",
                }}
                className=""
                tailwind="bg-white"
              />
            </View>
          ))}
        </View>
        <Animated.View
          key={selectedTab}
          entering={enteringAnimation}
          exiting={exitingAnimation}
          style={{
            flex: 1,
            marginTop: mt4,
            height: hp(38),
            alignItems: "center",
          }}
        >
          {selectedTab === "QR" ? (
            <QRCodeIcon height={qrSize} width={qrSize} />
          ) : (
            <View style={{ marginTop: mt5, alignItems: "center" }}>
              <ResponsiveUi.Text
                regular
                fontSize={hp(2)}
                color={colors.secondary}
              >
                Send funds to your wallet below
              </ResponsiveUi.Text>
              <ResponsiveUi.Text
                medium
                fontSize={hp(2)}
                style={{ marginTop: mt4 }}
              >
                {walletAddress
                  ? formatWalletAddress(walletAddress)
                  : "Wallet not connected"}
              </ResponsiveUi.Text>
              <IconList />
              <ResponsiveUi.Text
                center
                fontSize={hp(2)}
                color={colors.secondary}
                style={{ marginTop: mt4 }}
              >
                You can send tokens from Ethereum, Base, Arbitrum, Optimism,
                Scroll networks
              </ResponsiveUi.Text>
              <ResponsiveUi.Button
                title="Copy address"
                action={handleCopyAddress}
                style={{ marginTop: mt4 }}
                backgroundColor={colors.background}
                iconMiddle={
                  <Copy style={{ marginLeft: wp(4) }} color={colors.text} />
                }
                color={colors.text}
              />
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default SmartWallet;
