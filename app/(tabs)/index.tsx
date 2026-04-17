if (__DEV__) {
  require("../../ReactotronConfig");
}

import WalletBalance from "@/components/cards/walletBalance";
import "../../global.css";

import { get } from "@/api/apiClient";
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
import FiatCurrencySelectorModal from "@/components/modals/FiatCurrencySelectorModal";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { Colors } from "@/constants/Colors";
import useCustomFonts from "@/hooks/useCustomFonts";
import useFiatCurrencies from "@/hooks/useFiatCurrencies";
import { useThemeColors } from "@/hooks/useThemeColor";
import useWallet from "@/hooks/useWallet";
import { isPrivySupportedAsset, isPrivySupportedChain } from "@/utils/privy";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Keyboard, Switch, TouchableOpacity, View } from "react-native";
import ArrowDataTransfer from "../../components/svgs/arrow-data-transfer";

const toDecimalString = (rawValue: string, decimals: number) => {
  if (!rawValue || !/^\d+$/.test(rawValue)) {
    return "0";
  }

  const normalizedDecimals = Math.max(0, decimals);
  if (normalizedDecimals === 0) {
    return rawValue;
  }

  const padded = rawValue.padStart(normalizedDecimals + 1, "0");
  const whole = padded.slice(0, -normalizedDecimals) || "0";
  const fraction = padded.slice(-normalizedDecimals).replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole;
};

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

const DEFAULT_TESTNET_CHAIN: LifiChain = {
  id: 84532,
  key: "base_sepolia",
  name: "Base Sepolia",
  coin: "ETH",
  chainType: "EVM",
  mainnet: false,
  logoURI:
    "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg",
};

interface PaycrestRateResponse {
  status: string;
  message: string;
  data?: {
    buy?: {
      rate?: string;
    };
  };
}

const SUPPORTED_RATE_NETWORKS: Record<string, string> = {
  base: "base",
};
const ACTIVE_FIAT_CODES = new Set(["KES", "NGN"]);

export default function HomeScreen() {
  const colors = useThemeColors();
  const { loaded } = useCustomFonts();
  const {
    currencies: fiatCurrencies,
    isLoading: isFiatLoading,
    error: fiatError,
    refresh: refreshFiatCurrencies,
  } = useFiatCurrencies();
  const [amount, setAmount] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(true);
  const [isNativeKeyboardVisible, setIsNativeKeyboardVisible] = useState(false);
  const [isAssetSheetVisible, setIsAssetSheetVisible] = useState(false);
  const [isChainSheetVisible, setIsChainSheetVisible] = useState(false);
  const [isFiatModalVisible, setIsFiatModalVisible] = useState(false);
  const [isTestnetMode, setIsTestnetMode] = useState(false);
  const [fiatEstimate, setFiatEstimate] = useState<string>("0");
  const [activeRate, setActiveRate] = useState<number | null>(null);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState<LifiChain>(DEFAULT_CHAIN);
  const [selectedFromAsset, setSelectedFromAsset] = useState<LifiToken | null>(
    DEFAULT_ASSET,
  );
  const [selectedFiatCurrency, setSelectedFiatCurrency] =
    useState<string>("NGN");
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

  const maxSendAmount = useMemo(() => {
    if (!selectedFromAsset) {
      return "";
    }

    const firstBalance = walletBalance?.[0];
    if (!firstBalance?.raw_value) {
      return "";
    }

    const decimals =
      firstBalance.raw_value_decimals ?? selectedFromAsset.decimals ?? 18;

    return toDecimalString(firstBalance.raw_value, decimals);
  }, [selectedFromAsset, walletBalance]);

  const selectedFiatOption = useMemo(() => {
    const activeFiatCurrencies = fiatCurrencies.filter((item) =>
      ACTIVE_FIAT_CODES.has(item.code.toUpperCase()),
    );

    return (
      activeFiatCurrencies.find((item) => item.code === selectedFiatCurrency) ??
      activeFiatCurrencies[0] ??
      null
    );
  }, [selectedFiatCurrency, fiatCurrencies]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsNativeKeyboardVisible(true);
      setIsKeyboardVisible(false);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsNativeKeyboardVisible(false);
      setIsKeyboardVisible(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const network = SUPPORTED_RATE_NETWORKS[selectedChain.key];
    const token = selectedFromAsset?.symbol?.toLowerCase();
    const fiat = selectedFiatOption?.code;

    if (!network || !token || !fiat) {
      setActiveRate(null);
      setIsRateLoading(false);
      return;
    }

    let cancelled = false;

    const fetchRate = async () => {
      setIsRateLoading(true);
      try {
        const response = await get<PaycrestRateResponse>(
          `/rates/${network}/${token}/1/${fiat}`,
        );
        if (cancelled) {
          return;
        }

        const parsedRate = Number(response.data?.buy?.rate ?? 0);
        if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
          setActiveRate(null);
          return;
        }

        setActiveRate(parsedRate);
      } catch {
        if (cancelled) {
          return;
        }

        setActiveRate(null);
      } finally {
        if (!cancelled) {
          setIsRateLoading(false);
        }
      }
    };

    fetchRate();

    return () => {
      cancelled = true;
    };
  }, [selectedChain.key, selectedFromAsset?.symbol, selectedFiatOption?.code]);

  useEffect(() => {
    const normalizedAmount = amount.trim();
    const numericAmount = Number(normalizedAmount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !activeRate) {
      setFiatEstimate("0");
      return;
    }

    const estimatedValue = numericAmount * activeRate;
    setFiatEstimate(
      estimatedValue.toLocaleString(undefined, {
        maximumFractionDigits: selectedFiatOption?.decimals ?? 2,
      }),
    );
  }, [amount, activeRate, selectedFiatOption?.decimals]);

  useEffect(() => {
    if (isAssetSheetVisible || isChainSheetVisible || isFiatModalVisible) {
      setIsKeyboardVisible(false);
    }
  }, [isAssetSheetVisible, isChainSheetVisible, isFiatModalVisible]);

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
            onPress={() => {
              setIsKeyboardVisible(false);
              setIsChainSheetVisible(true);
            }}
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
        <View className="flex-row items-center justify-between mt-4 px-1">
          <ResponsiveUi.Text medium fontSize={14} color={colors.secondary}>
            Testnet mode
          </ResponsiveUi.Text>
          <Switch
            value={isTestnetMode}
            onValueChange={(enabled) => {
              setIsTestnetMode(enabled);
              setSelectedChain(enabled ? DEFAULT_TESTNET_CHAIN : DEFAULT_CHAIN);
              setSelectedFromAsset(enabled ? null : DEFAULT_ASSET);
            }}
            trackColor={{ false: colors.secondary, true: colors.slate }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.gray_hover}
          />
        </View>
        <View className=" mt-8 px-4">
          <WalletBalance
            selectedAsset={selectedFromAsset}
            chainLogoURI={selectedChain.logoURI}
            privyBalanceLabel={sendAssetBalanceLabel}
            onUseMaxPress={() => {
              if (!maxSendAmount || maxSendAmount === "0") {
                Alert.alert(
                  "No balance",
                  "No available balance for the selected asset.",
                );
                return;
              }

              setAmount(maxSendAmount);
            }}
            onAssetPress={() => {
              setIsKeyboardVisible(false);
              setIsAssetSheetVisible(true);
            }}
          />
          <SwapInput
            value={amount}
            selectedAssetSymbol={selectedFromAsset?.symbol}
            isDisabled={isAssetSheetVisible || isChainSheetVisible}
            onFocus={() => {
              setIsKeyboardVisible(true);
            }}
          />
          <CurrencySelector
            selectedAsset={
              selectedFiatOption
                ? {
                    symbol: selectedFiatOption?.code,
                    name: selectedFiatOption?.name,
                    logoURI: selectedFiatOption.logoURI,
                  }
                : null
            }
            label={selectedFiatOption?.name}
            subtitle={
              isRateLoading
                ? "Fetching rate..."
                : `Receive ${selectedFiatOption?.code}`
            }
            rightValue={fiatEstimate}
            isLoading={isRateLoading}
            onPress={() => {
              setIsKeyboardVisible(false);
              setIsFiatModalVisible(true);
            }}
          />
          <View className="mt-8 flex-row items-center justify-center">
            <ResponsiveUi.Text color={colors.secondary}>
              1 {selectedFromAsset?.symbol}
            </ResponsiveUi.Text>
            <ArrowDataTransfer
              width={14}
              height={14}
              style={{ marginHorizontal: 6 }}
            />
            <ResponsiveUi.Text color={colors.secondary}>
              {activeRate
                ? `${activeRate.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })} ${selectedFiatOption?.code}`
                : "N/A"}
            </ResponsiveUi.Text>
          </View>
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

          setSelectedFromAsset(asset);
        }}
        selectedAssetAddress={selectedFromAsset?.address}
        chainLogoURI={selectedChain.logoURI}
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
          if (!isTestnetMode && chain.id === DEFAULT_CHAIN.id) {
            setSelectedFromAsset(DEFAULT_ASSET);
            return;
          }

          setSelectedFromAsset(null);
        }}
        selectedChainId={selectedChain.id}
        includeTestnets={isTestnetMode}
      />
      <FiatCurrencySelectorModal
        isVisible={isFiatModalVisible}
        onClose={() => setIsFiatModalVisible(false)}
        selectedCode={selectedFiatCurrency}
        currencies={fiatCurrencies}
        isLoading={isFiatLoading}
        error={fiatError}
        onRetry={refreshFiatCurrencies}
        onSelect={(currency) => {
          if (!ACTIVE_FIAT_CODES.has(currency.code.toUpperCase())) {
            return;
          }

          setSelectedFiatCurrency(currency.code);
        }}
      />
      <BaseSheet
        isVisible={isKeyboardVisible}
        snapPoints={["46%"]}
        showBackdrop={false}
        hideHandle
        isDismissible={isNativeKeyboardVisible}
        onVisibilityChange={(visible) => {
          if (visible) {
            setIsKeyboardVisible(true);
            return;
          }

          if (isNativeKeyboardVisible) {
            setIsKeyboardVisible(false);
          }
        }}
      >
        <CustomKeyBoard
          value={amount}
          onChangeText={setAmount}
          onDismiss={() => {
            if (isNativeKeyboardVisible) {
              setIsKeyboardVisible(false);
            }
          }}
          onSubmit={() => {
            if (isNativeKeyboardVisible) {
              setIsKeyboardVisible(false);
            }
          }}
          visible={isKeyboardVisible}
          submitLabel="Continue"
        />
      </BaseSheet>
    </>
  );
}
