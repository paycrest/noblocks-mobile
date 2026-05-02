import IconList from "@/components/iconList";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import QRCodeIcon from "@/components/svgs/qr-code";
import USDC from "@/components/svgs/usdc-icon";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { formatAmount } from "@/utils/general";
import { CircleQuestionMark, Copy } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { Dimensions, View } from "react-native";
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

  const { height } = Dimensions.get("window");

  // Responsive spacing and sizing
  const mt6 = hp(2.5);
  const mt12 = hp(5);
  const mt2 = hp(0.8);
  const mt4 = hp(1.5);
  const mt5 = hp(2);
  const px2 = wp(4);
  const py2 = hp(1);
  const tabButtonFontSize = hp(1.7);
  const tabButtonWidth = wp(35);
  const qrSize = hp(28);

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
          {formatAmount(1234.56, "$")}
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
            {formatAmount(1234.56, "")} USDC
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
            width: "auto",
            paddingHorizontal: px2,
            borderRadius: 999,
            justifyContent: "center",
            paddingVertical: py2,
            backgroundColor: colors.gray2,
            marginTop: mt6,
            alignItems: "center",
          }}
        >
          {TABS.map((tab) => (
            <Animated.View
              key={tab}
              entering={SlideInLeft.delay(100)}
              exiting={SlideInRight}
              style={{ width: tabButtonWidth, alignSelf: "center" }}
            >
              <ResponsiveUi.Button
                title={tab}
                fontSize={tabButtonFontSize}
                backgroundColor={
                  selectedTab === tab ? colors.primary_2 : "transparent"
                }
                color={selectedTab === tab ? colors.lavendar : colors.secondary}
                action={() => setSelectedTab(tab)}
                style={{ width: "100%", textAlign: "center" }}
              />
            </Animated.View>
          ))}
        </View>
        {/* Animated tab content */}
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
                0xa5d962C...C5821eb1024
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
                title="Copy codes"
                action={() => {}}
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
