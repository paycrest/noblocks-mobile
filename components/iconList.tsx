import React, { FunctionComponent } from "react";
import { View } from "react-native";
import USDC from "@/components/svgs/usdc-icon";
import Tether from "@/components/svgs/tether";
import Binance from "@/components/svgs/binance";
import Optimism from "./svgs/optimism";
import EthereumIcon from "./svgs/ethereum";
import RandomAsset from "./svgs/random-asset";

const IconList: FunctionComponent = () => {
  return (
    <View className="flex-row items-center mt-4 justify-between">
      <USDC width={20} height={20} />
      <Tether width={20} height={20} className="-ml-2" />
      <Binance width={20} height={20} className="-ml-2" />
      <Optimism width={20} height={20} className="-ml-2" />
      <EthereumIcon width={20} height={20} className="-ml-2" />
      <RandomAsset width={20} height={20} className="-ml-2" />
    </View>
  );
};

export default IconList;
