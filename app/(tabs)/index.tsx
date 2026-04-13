if (__DEV__) {
  require("../../ReactotronConfig");
}

import WalletBalance from "@/components/cards/walletBalance";
import "../../global.css";

import CurrencySelector from "@/components/cards/CurrencySelector";
import CustomKeyBoard from "@/components/inputs/CustomKeyBoard";
import SwapInput from "@/components/inputs/SwapInput";
import AppLayout from "@/components/layouts/AppLayout";
import AssetSelectorSheet, {
  type LifiToken,
} from "@/components/modals/AssetSelectorSheet";
import BaseSheet from "@/components/modals/BottomSheet";
import ChainSelectorSheet, {
  type LifiChain,
} from "@/components/modals/ChainSelectorSheet";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { Colors } from "@/constants/Colors";
import useCustomFonts from "@/hooks/useCustomFonts";
import useWallet from "@/hooks/useWallet";
import { isPrivySupportedAsset, isPrivySupportedChain } from "@/utils/privy";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";

const DEFAULT_CHAIN: LifiChain = {
  id: 8453,
  key: "base",
  name: "Base",
  coin: "ETH",
  chainType: "EVM",
  mainnet: true,
  logoURI:
    "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg",
};

const DEFAULT_ASSET: LifiToken = {
  chainId: 8453,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
};

const DEFAULT_RECEIVE_ASSET: LifiToken = {
  chainId: 8453,
  address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
};

export default function HomeScreen() {
  const { loaded } = useCustomFonts();
  const [amount, setAmount] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isAssetSheetVisible, setIsAssetSheetVisible] = useState(false);
  const [isChainSheetVisible, setIsChainSheetVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState<LifiChain>(DEFAULT_CHAIN);
  const [selectedFromAsset, setSelectedFromAsset] = useState<LifiToken | null>(
    DEFAULT_ASSET,
  );
  const [selectedReceiveAsset, setSelectedReceiveAsset] =
    useState<LifiToken | null>(DEFAULT_RECEIVE_ASSET);
  const [assetSelectionTarget, setAssetSelectionTarget] = useState<
    "from" | "to"
  >("to");
  const { walletBalance } = useWallet({
    chain: selectedChain.key,
    asset: selectedFromAsset?.symbol?.toLowerCase() ?? "eth",
  });

  const sendAssetBalanceLabel = useMemo(() => {
    if (!selectedFromAsset) {
      return "--";
    }

    const firstBalance = walletBalance?.[0];
    if (!firstBalance) {
      return "--";
    }

    const symbol = selectedFromAsset.symbol;
    const symbolLower = symbol.toLowerCase();
    const displayValue =
      firstBalance.display_values?.[symbolLower] ??
      firstBalance.display_values?.[symbol];

    if (displayValue) {
      return `${displayValue} ${symbol}`;
    }

    const decimals =
      firstBalance.raw_value_decimals ?? selectedFromAsset.decimals ?? 18;
    const numericValue = Number(firstBalance.raw_value) / 10 ** decimals;

    if (!Number.isFinite(numericValue)) {
      return "--";
    }

    return `${numericValue.toLocaleString(undefined, {
      maximumFractionDigits: 6,
    })} ${symbol}`;
  }, [selectedFromAsset, walletBalance]);

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
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center"
            onPress={() => setIsChainSheetVisible(true)}
          >
            {selectedChain.logoURI ? (
              <Image
                source={{ uri: selectedChain?.logoURI }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  marginRight: 8,
                }}
              />
            ) : null}
            <ResponsiveUi.Text className="mt-4" medium fontSize={15}>
              {selectedChain.name}
            </ResponsiveUi.Text>
            <ChevronDown
              color={Colors.primary}
              size={16}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>
        <View className=" mt-8 px-4">
          <WalletBalance
            selectedAsset={selectedFromAsset}
            privyBalanceLabel={sendAssetBalanceLabel}
            onAssetPress={() => {
              setAssetSelectionTarget("from");
              setIsAssetSheetVisible(true);
            }}
          />
          <SwapInput
            value={amount}
            selectedAssetSymbol={selectedFromAsset?.symbol}
            onFocus={() => {
              setIsKeyboardVisible(true);
            }}
          />
          <CurrencySelector
            selectedAsset={selectedReceiveAsset}
            onPress={() => {
              setAssetSelectionTarget("to");
              setIsAssetSheetVisible(true);
            }}
          />
        </View>
      </AppLayout>
      <AssetSelectorSheet
        chainId={selectedChain.id}
        isVisible={isAssetSheetVisible}
        onClose={() => setIsAssetSheetVisible(false)}
        onSelect={(asset) => {
          if (!isPrivySupportedAsset(asset.symbol)) {
            Alert.alert(
              "Unsupported asset",
              "This asset is not supported by Privy balance yet.",
            );
            return;
          }

          if (assetSelectionTarget === "from") {
            if (
              selectedReceiveAsset?.address.toLowerCase() ===
              asset.address.toLowerCase()
            ) {
              Alert.alert(
                "Invalid pair",
                "Swap from and receive assets cannot be the same.",
              );
              return;
            }

            setSelectedFromAsset(asset);
            return;
          }

          if (
            selectedFromAsset?.address.toLowerCase() ===
            asset.address.toLowerCase()
          ) {
            Alert.alert(
              "Invalid pair",
              "Swap from and receive assets cannot be the same.",
            );
            return;
          }

          setSelectedReceiveAsset(asset);
        }}
        selectedAssetAddress={
          assetSelectionTarget === "from"
            ? selectedFromAsset?.address
            : selectedReceiveAsset?.address
        }
      />
      <ChainSelectorSheet
        isVisible={isChainSheetVisible}
        onClose={() => setIsChainSheetVisible(false)}
        onSelect={(chain) => {
          if (!isPrivySupportedChain(chain.key)) {
            Alert.alert(
              "Unsupported chain",
              "This chain is not supported by Privy balance yet.",
            );
            return;
          }

          setSelectedChain(chain);
          setSelectedFromAsset(
            chain.id === DEFAULT_CHAIN.id ? DEFAULT_ASSET : null,
          );
          setSelectedReceiveAsset(
            chain.id === DEFAULT_CHAIN.id ? DEFAULT_RECEIVE_ASSET : null,
          );
        }}
        selectedChainId={selectedChain.id}
      />
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
