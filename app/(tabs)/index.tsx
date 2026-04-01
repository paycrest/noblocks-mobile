if (__DEV__) {
  require("../../ReactotronConfig");
}

import WalletBalance from "@/components/cards/walletBalance";
import "../../global.css";

import CurrencySelector from "@/components/cards/CurrencySelector";
import CustomKeyBoard from "@/components/inputs/CustomKeyBoard";
import SwapInput from "@/components/inputs/SwapInput";
import AppLayout from "@/components/layouts/AppLayout";
import BaseSheet from "@/components/modals/BottomSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import CryptoNetwork from "@/components/svgs/crypto-network";
import { Colors } from "@/constants/Colors";
import useCustomFonts from "@/hooks/useCustomFonts";
import React, { useState } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const { loaded } = useCustomFonts();
  const [amount, setAmount] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <AppLayout>
        <View className="flex-row items-center justify-center self-center">
          <ResponsiveUi.Text bold color={Colors.primary}>
            Details
          </ResponsiveUi.Text>
          <View className="ml-4 flex-row">
            <View className="border rounded-full w-3 h-3 border-primary" />
            <View className="border rounded-full w-3 h-3 ml-2 border-primary" />
            <View className="border rounded-full w-3 h-3 ml-2 border-primary" />
          </View>
        </View>
        <View className="flex-row mt-8 justify-between">
          <ResponsiveUi.Text className="mt-4" semiBold fontSize={18}>
            Swap
          </ResponsiveUi.Text>
          <View className="flex-row items-center">
            <CryptoNetwork className="mr-2" />
            <ResponsiveUi.Text className="mt-4" medium fontSize={15}>
              Base
            </ResponsiveUi.Text>
          </View>
        </View>
        <View className=" mt-8 px-4">
          <WalletBalance />
          <SwapInput
            value={amount}
            onFocus={() => {
              setIsKeyboardVisible(true);
            }}
          />
          <CurrencySelector />
        </View>
      </AppLayout>
      <BaseSheet
        isVisible={isKeyboardVisible}
        onVisibilityChange={setIsKeyboardVisible}
      >
        <CustomKeyBoard
          value={amount}
          onChangeText={setAmount}
          onDismiss={() => setIsKeyboardVisible(false)}
          onSubmit={() => setIsKeyboardVisible(false)}
          visible={isKeyboardVisible}
          submitLabel="Continue"
        />
      </BaseSheet>
    </>
  );
}
