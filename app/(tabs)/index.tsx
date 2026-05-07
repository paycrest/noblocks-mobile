if (__DEV__) {
  require("../../ReactotronConfig");
}

import WalletBalance from "@/components/cards/walletBalance";
import "../../global.css";

import { RATE_QUERY_STALE_TIME_MS } from "@/api/queryConstants";
import { fetchPaycrestRate } from "@/api/queryFns";
import { useSelector } from "@/app/store/Store";
import CurrencySelector from "@/components/cards/CurrencySelector";
import SwapChainRow from "@/components/cards/SwapChainRow";
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
import WalletIcon from "@/components/svgs/wallet";
import useCustomFonts from "@/hooks/useCustomFonts";
import useFiatCurrencies from "@/hooks/useFiatCurrencies";
import { useThemeColors } from "@/hooks/useThemeColor";
import useWallet from "@/hooks/useWallet";
import { isPrivySupportedAsset, isPrivySupportedChain } from "@/utils/privy";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronDown, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import ArrowDataTransfer from "../../components/svgs/arrow-data-transfer";
import SmartWallet from "../(home)/smartWallet";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useAppDimensions } from "@/hooks/useAppDimensions";

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

const SUPPORTED_RATE_NETWORKS: Record<string, string> = {
  base: "base",
  base_sepolia: "base",
  eth: "ethereum",
  ethereum: "ethereum",
  arb: "arbitrum",
  arbitrum: "arbitrum",
  opt: "optimism",
  optimism: "optimism",
  pol: "polygon",
  polygon: "polygon",
};
const ACTIVE_FIAT_CODES = new Set(["KES", "NGN"]);

export default function HomeScreen() {
  const isFocused = useIsFocused();
  const {
    _hasHydrated,
    swapDraftAmount,
    swapDraftAsset,
    setSwapDraftAmount,
    setSwapDraftAsset,
  } = useSelector([
    "_hasHydrated",
    "swapDraftAmount",
    "swapDraftAsset",
    "setSwapDraftAmount",
    "setSwapDraftAsset",
  ]);
  const colors = useThemeColors();
  const { loaded } = useCustomFonts();
  const [amount, setAmount] = useState(swapDraftAmount || "");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isAssetSheetVisible, setIsAssetSheetVisible] = useState(false);
  const [isChainSheetVisible, setIsChainSheetVisible] = useState(false);
  const [isFiatModalVisible, setIsFiatModalVisible] = useState(false);
  const {
    currencies: fiatCurrencies,
    isLoading: isFiatLoading,
    error: fiatError,
    refresh: refreshFiatCurrencies,
  } = useFiatCurrencies({ enabled: isFiatModalVisible });
  const [isTestnetMode, setIsTestnetMode] = useState(false);
  const [fiatEstimate, setFiatEstimate] = useState<string>("0");
  const [selectedChain, setSelectedChain] = useState<LifiChain>(DEFAULT_CHAIN);
  const [selectedFromAsset, setSelectedFromAsset] = useState<LifiToken | null>(
    swapDraftAsset
      ? {
          chainId: swapDraftAsset.chainId,
          address: swapDraftAsset.address,
          symbol: swapDraftAsset.symbol,
          name: swapDraftAsset.name,
          decimals: swapDraftAsset.decimals,
          logoURI: swapDraftAsset.logoURI,
        }
      : DEFAULT_ASSET,
  );
  const [selectedFiatCurrency, setSelectedFiatCurrency] =
    useState<string>("NGN");
  const [didRestoreDraft, setDidRestoreDraft] = useState(false);
  const { walletBalance } = useWallet({
    chain: selectedChain.key,
    asset: selectedFromAsset?.symbol?.toLowerCase() ?? "eth",
  });
  const [isSmartWalletScreenVisible, setIsSmartWalletScreenVisible] =
    useState(false);
  const { hp, wp } = useAppDimensions();

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

  const selectedRateNetwork = SUPPORTED_RATE_NETWORKS[selectedChain.key];
  const selectedRateToken = selectedFromAsset?.symbol?.toLowerCase();
  const selectedRateFiat = selectedFiatOption?.code;

  const { data: rateResponse, isLoading: isRateLoading } = useQuery({
    queryKey: [
      "paycrest",
      "rate",
      selectedRateNetwork,
      selectedRateToken,
      selectedRateFiat,
    ],
    enabled: Boolean(
      selectedRateNetwork && selectedRateToken && selectedRateFiat,
    ),
    queryFn: async () => {
      return fetchPaycrestRate(
        selectedRateNetwork!,
        selectedRateToken!,
        selectedRateFiat!,
      );
    },
    staleTime: RATE_QUERY_STALE_TIME_MS,
  });

  const activeRate = useMemo(() => {
    const parsedRate = Number(rateResponse?.data?.buy?.rate ?? 0);
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      return null;
    }

    return parsedRate;
  }, [rateResponse?.data?.buy?.rate]);

  const isAmountZeroOrEmpty = useMemo(() => {
    const normalizedAmount = amount.trim();
    if (!normalizedAmount) {
      return true;
    }

    const parsedAmount = Number(normalizedAmount);
    if (!Number.isFinite(parsedAmount)) {
      return true;
    }

    return parsedAmount <= 0;
  }, [amount]);

  const isAnyModalOpen =
    isAssetSheetVisible || isChainSheetVisible || isFiatModalVisible;

  useEffect(() => {
    if (!_hasHydrated || didRestoreDraft) {
      return;
    }

    if (swapDraftAmount) {
      setAmount(swapDraftAmount);
    }

    if (swapDraftAsset) {
      setSelectedFromAsset({
        chainId: swapDraftAsset.chainId,
        address: swapDraftAsset.address,
        symbol: swapDraftAsset.symbol,
        name: swapDraftAsset.name,
        decimals: swapDraftAsset.decimals,
        logoURI: swapDraftAsset.logoURI,
      });
    }

    setDidRestoreDraft(true);
  }, [_hasHydrated, didRestoreDraft, swapDraftAmount, swapDraftAsset]);

  useEffect(() => {
    if (!_hasHydrated || !didRestoreDraft) {
      return;
    }

    setSwapDraftAmount(amount);
  }, [_hasHydrated, didRestoreDraft, amount, setSwapDraftAmount]);

  useEffect(() => {
    if (!_hasHydrated || !didRestoreDraft) {
      return;
    }

    if (!selectedFromAsset) {
      setSwapDraftAsset(null);
      return;
    }

    setSwapDraftAsset({
      chainId: selectedFromAsset.chainId,
      address: selectedFromAsset.address,
      symbol: selectedFromAsset.symbol,
      name: selectedFromAsset.name,
      decimals: selectedFromAsset.decimals,
      logoURI: selectedFromAsset.logoURI ?? "",
    });
  }, [_hasHydrated, didRestoreDraft, selectedFromAsset, setSwapDraftAsset]);

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
    router.setParams({
      smartWalletVisible: isSmartWalletScreenVisible ? "true" : "false",
      keyboardVisible: isKeyboardVisible ? "true" : "false",
    });
  }, [isSmartWalletScreenVisible, isKeyboardVisible, router]);

  if (!loaded) {
    return null;
  }

  // Responsive values
  const chainLogoMargin = wp(2);
  const chainFontSize = hp(1.8);
  const swapMarginTop = hp(3.5);
  const walletDotSize = wp(3.5);
  const walletDotMargin = wp(1.2);
  const arrowSize = wp(4);
  const mt8 = hp(2);

  return (
    <>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <AppLayout scrollable={true}>
          <Animated.View
            // This single container controls the swap/smart-wallet section
            layout={Layout.springify().damping(18).stiffness(150)}
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(250)}
            style={{ flex: 1 }}
          >
            {isSmartWalletScreenVisible && (
              <Animated.View
                key="smart-wallet"
                entering={FadeIn.duration(400).delay(80)}
                exiting={FadeOut.duration(250)}
                style={{ flex: 1 }}
              >
                <SmartWallet />
              </Animated.View>
            )}
            <Animated.View
              key="swap-ui"
              entering={FadeIn.duration(400).delay(80)}
              exiting={FadeOut.duration(250)}
              className={`flex-row items-center m justify-${isKeyboardVisible ? "between" : "center"}`}
            >
              <View className="flex-row w-36 justify-between items-center">
                <View
                  style={{
                    backgroundColor: colors.primary_2,
                    borderRadius: 16,
                    paddingVertical: 4,
                    paddingHorizontal: 12,
                  }}
                >
                  <ResponsiveUi.Text
                    medium
                    color={colors.primary}
                    fontSize={hp(2.3)}
                  >
                    Details
                  </ResponsiveUi.Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: walletDotSize / 2,
                    width: walletDotSize,
                    height: walletDotSize,
                    borderColor: colors.primary,
                  }}
                />
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: walletDotSize / 2,
                    width: walletDotSize,
                    height: walletDotSize,
                    borderColor: colors.primary,
                    marginLeft: walletDotMargin,
                  }}
                />
              </View>
              {isKeyboardVisible && (
                <View className="flex-row items-center">
                  <WalletIcon
                    onPress={() =>
                      setIsSmartWalletScreenVisible((prev) => !prev)
                    }
                    height={hp(3.5)}
                    width={hp(3.5)}
                    style={{ marginRight: walletDotMargin * 2 }}
                  />
                  <X
                    color={colors.secondary}
                    height={hp(3.5)}
                    width={hp(3.5)}
                    onPress={() =>
                      isSmartWalletScreenVisible
                        ? setIsSmartWalletScreenVisible(false)
                        : setIsKeyboardVisible(false)
                    }
                  />
                </View>
              )}
            </Animated.View>
            <>
              <SwapChainRow
                title="Swap"
                chainName={selectedChain.name}
                chainLogoUri={selectedChain.logoURI}
                marginTop={swapMarginTop}
                onPress={() => {
                  setIsChainSheetVisible(true);
                  setIsKeyboardVisible(false);
                }}
              />
              {/* <View className="flex-row items-center justify-between mt-4 px-1">
                    <ResponsiveUi.Text
                      medium
                      fontSize={14}
                      color={colors.secondary}
                    >
                      Testnet mode
                    </ResponsiveUi.Text>
                    <Switch
                      value={isTestnetMode}
                      onValueChange={(enabled) => {
                        setIsTestnetMode(enabled);
                        setSelectedChain(
                          enabled ? DEFAULT_TESTNET_CHAIN : DEFAULT_CHAIN,
                        );
                        setSelectedFromAsset(enabled ? null : DEFAULT_ASSET);
                      }}
                      trackColor={{
                        false: colors.secondary,
                        true: colors.slate,
                      }}
                      thumbColor={colors.white}
                      ios_backgroundColor={colors.gray_hover}
                    />
                  </View> */}
              {!isSmartWalletScreenVisible && (
                <View style={{ marginTop: mt8 }}>
                  <View
                    style={{
                      backgroundColor: colors.neutral_surface,
                      borderRadius: 16,
                    }}
                  >
                    <View style={{ position: "relative" }}>
                      <View className="bg-neutral_surface rounded-2xl  py-3 border border-subtle_surface">
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
                            setIsAssetSheetVisible(true);
                            setIsKeyboardVisible(false);
                          }}
                        />
                        <View className=" w-full self-center border-t my-3 h-1 border-subtle_surface" />
                        <SwapInput
                          value={amount}
                          selectedAssetSymbol={selectedFromAsset?.symbol}
                          isDisabled={
                            isAssetSheetVisible || isChainSheetVisible
                          }
                          onFocus={() => {
                            setIsKeyboardVisible(true);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          position: "absolute",
                          bottom: -26,
                          left: 0,
                          right: 0,
                          alignItems: "center",
                          zIndex: 22,
                        }}
                      >
                        <View className="border border-subtle_surface rounded-full py-2 px-2 bg-neutral_surface  ">
                          <ChevronDown size={20} color={colors.secondary} />
                        </View>
                      </View>
                    </View>
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
                        !selectedFiatOption
                          ? "Select currency"
                          : isRateLoading
                            ? "Fetching rate..."
                            : `Receive ${selectedFiatOption?.code}`
                      }
                      rightValue={fiatEstimate}
                      isLoading={isRateLoading}
                      onPress={() => {
                        setIsFiatModalVisible(true);
                        setIsKeyboardVisible(false);
                      }}
                    />
                  </View>
                  {selectedFiatOption && (
                    <View
                      style={{
                        marginTop: mt8 * 1.4,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ResponsiveUi.Text
                        color={colors.secondary}
                        fontSize={chainFontSize}
                      >
                        1 {selectedFromAsset?.symbol}
                      </ResponsiveUi.Text>
                      <ArrowDataTransfer
                        width={arrowSize}
                        height={arrowSize}
                        style={{ marginHorizontal: chainLogoMargin }}
                      />
                      <ResponsiveUi.Text
                        color={colors.secondary}
                        fontSize={chainFontSize}
                      >
                        {activeRate
                          ? `${activeRate.toLocaleString(undefined, {
                              maximumFractionDigits: 6,
                            })} ${selectedFiatOption?.code}`
                          : "N/A"}
                      </ResponsiveUi.Text>
                    </View>
                  )}
                </View>
              )}
            </>
          </Animated.View>
        </AppLayout>
      </Animated.View>
      {!isSmartWalletScreenVisible && (
        <>
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
              setIsAssetSheetVisible(false);
              // setIsKeyboardVisible(true);
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
            snapPoints={["45%"]}
            showBackdrop={false}
            hideHandle
            isDismissible={true}
          >
            <CustomKeyBoard
              value={amount}
              onChangeText={setAmount}
              onSubmit={() => {
                if (isAmountZeroOrEmpty) {
                  return;
                }
                if (!selectedFiatOption) {
                  return;
                }

                router.push({
                  pathname: "/(home)/swapRecipient",
                  params: {
                    amount,
                    fromChainKey: selectedChain.key,
                    fromChainName: selectedChain.name,
                    fromChainId: String(selectedChain.id),
                    fromChainLogoUri: selectedChain.logoURI ?? "",
                    fromAssetAddress: selectedFromAsset?.address ?? "",
                    fromAssetUri: selectedFromAsset?.logoURI ?? "",
                    fromAssetSymbol: selectedFromAsset?.symbol ?? "",
                    fromAssetName: selectedFromAsset?.name ?? "",
                    toFiatCode: selectedFiatOption?.code ?? "",
                    toFiatUri: selectedFiatOption?.logoURI ?? "",
                    rate: activeRate !== null ? String(activeRate) : "",
                    fiatEstimate,
                  },
                });
                setIsKeyboardVisible(false);
              }}
              visible={isKeyboardVisible}
              submitLabel="Continue"
              submitDisabled={
                isAmountZeroOrEmpty || !selectedFiatOption || !selectedChain
              }
            />
          </BaseSheet>
        </>
      )}
    </>
  );
}
