import { ResponsiveUi } from "@/components/ResponsiveUi";
import QRCodeIcon from "@/components/svgs/qr-code";
import USDC from "@/components/svgs/usdc-icon";
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

  const enteringAnimation = isGoingRight
    ? SlideInLeft.duration(250)
    : SlideInRight.duration(250);

  const exitingAnimation = isGoingRight
    ? SlideOutLeft.duration(250)
    : SlideOutRight.duration(250);

  const { height } = Dimensions.get("window");

  return (
    <View className=" mt-6">
      <View className="flex-row items-center justify-center">
        <ResponsiveUi.Text medium tailwind="mr-3" fontSize={18}>
          Smart Wallet
        </ResponsiveUi.Text>
        <CircleQuestionMark color={colors.secondary} size={18} />
      </View>
      <View className="items-center justify-center mt-6">
        <ResponsiveUi.Text bold fontSize={36}>
          {formatAmount(1234.56, "$")} {/* Example balance */}
        </ResponsiveUi.Text>
        <View className="flex-row items-center mt-2">
          <USDC height={20} width={20} />
          <ResponsiveUi.Text medium fontSize={16} tailwind="ml-2">
            {formatAmount(1234.56, "")} USDC
          </ResponsiveUi.Text>
        </View>
      </View>
      <View className="mt-12 items-center justify-center">
        <ResponsiveUi.Text>Fund wallet</ResponsiveUi.Text>
        <View className="flex-row w-auto px-2 rounded-full justify-center py-2 bg-gray2 mt-6 items-center">
          {TABS.map((tab) => (
            <Animated.View
              key={tab}
              entering={SlideInLeft.delay(100)}
              exiting={SlideInRight}
              style={{ width: "40%", alignSelf: "center" }}
            >
              <ResponsiveUi.Button
                title={tab}
                fontSize={12}
                backgroundColor={
                  selectedTab === tab ? colors.primary_2 : "transparent"
                }
                color={selectedTab === tab ? colors.lavendar : colors.secondary}
                action={() => setSelectedTab(tab)}
                tailwind="w-full text-center"
              />
            </Animated.View>
          ))}
        </View>
        {/* Animated tab content */}
        <Animated.View
          key={selectedTab}
          entering={enteringAnimation}
          exiting={exitingAnimation}
          style={{ marginTop: 16, height: height / 2.5, alignItems: "center" }}
        >
          {selectedTab === "QR" ? (
            <QRCodeIcon />
          ) : (
            <View className="mt-12 items-center">
              <ResponsiveUi.Text regular fontSize={14} color={colors.secondary}>
                Send funds to your wallet below
              </ResponsiveUi.Text>
              <ResponsiveUi.Text medium fontSize={20} tailwind="mt-4">
                0xa5d962C...C5821eb1024
              </ResponsiveUi.Text>
              <ResponsiveUi.Text
                center
                fontSize={14}
                color={colors.secondary}
                tailwind="mt-4"
              >
                You can send tokens from Ethereum, Base, Arbitrum, Optimism,
                Scroll networks
              </ResponsiveUi.Text>
              <ResponsiveUi.Button
                title="Copy codes"
                action={() => {}}
                className="mt-12"
                backgroundColor={colors.background}
                iconMiddle={<Copy className="ml-4" color={colors.text} />}
                color={colors.text}
                containerStyle="mt-12"
              />
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default SmartWallet;
