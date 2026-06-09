if (__DEV__) {
  require("../../ReactotronConfig");
}

import WalletBalance from "@/components/cards/walletBalance";
import "../../global.css";

import { RATE_QUERY_STALE_TIME_MS } from "@/api/queryConstants";
import { fetchPaycrestRate } from "@/api/queryFns";
import { useSelector } from "@/store/Store";
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
import SwapFlowStepper from "@/components/swap/SwapFlowStepper";
import SwapFlowWalletPeekLayout from "@/components/swap/SwapFlowWalletPeekLayout";
import SwapScreenSheet from "@/components/swap/SwapScreenSheet";
import LiquidGlassTransition from "@/components/transitions/LiquidGlassTransition";
import useFiatCurrencies from "@/hooks/useFiatCurrencies";
import { useLiquidGlassScreenTransition } from "@/hooks/useLiquidGlassScreenTransition";
import { useThemeColors } from "@/hooks/useThemeColor";
import useWallet from "@/hooks/useWallet";
import {
  isSupportedSwapChain,
  toPaycrestNetworkKey,
} from "@/lib/chains/supportedSwapChains";
import { setLiquidGlassTransition } from "@/lib/transitions/liquidGlassNavigation";
import { isPrivySupportedAsset } from "@/utils/privy";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import ArrowDataTransfer from "../../components/svgs/arrow-data-transfer";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useAppDimensions } from "@/hooks/useAppDimensions";

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
  const { animationKey: detailsAnimationKey } = useLiquidGlassScreenTransition(
    "details",
    "entry",
  );
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
  const { getBalanceLabel, getMaxAmount } = useWallet({
    chain: selectedChain.key,
    asset: selectedFromAsset?.symbol?.toLowerCase() ?? "usdc",
  });
  const [isSmartWalletScreenVisible, setIsSmartWalletScreenVisible] =
    useState(false);
  const { hp, wp, isSmallScreen, isLargeScreen } = useAppDimensions();

  const sendAssetBalanceLabel = useMemo(() => {
    if (!selectedFromAsset) {
      return "--";
    }

    return getBalanceLabel(selectedFromAsset.symbol);
  }, [getBalanceLabel, selectedFromAsset]);

  const maxSendAmount = useMemo(() => {
    if (!selectedFromAsset) {
      return "";
    }

    return getMaxAmount(
      selectedFromAsset.symbol,
      selectedFromAsset.decimals ?? 18,
    );
  }, [getMaxAmount, selectedFromAsset]);

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

  const selectedRateNetwork = toPaycrestNetworkKey(
    selectedChain.key,
    selectedChain.id,
  );
  const selectedRateToken = selectedFromAsset?.symbol?.toLowerCase();
  const selectedRateFiat = selectedFiatOption?.code;

  const rateQueryAmount = useMemo(() => {
    const parsedAmount = Number(amount.trim());
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return 1;
    }
    return parsedAmount;
  }, [amount]);

  const { data: rateResponse, isLoading: isRateLoading } = useQuery({
    queryKey: [
      "paycrest",
      "rate",
      selectedRateNetwork,
      selectedRateToken,
      selectedRateFiat,
      rateQueryAmount,
      "sell",
    ],
    enabled: Boolean(
      selectedRateNetwork && selectedRateToken && selectedRateFiat,
    ),
    queryFn: async () => {
      return fetchPaycrestRate(
        selectedRateNetwork!,
        selectedRateToken!,
        selectedRateFiat!,
        rateQueryAmount,
        "sell",
      );
    },
    staleTime: RATE_QUERY_STALE_TIME_MS,
  });

  const activeRate = useMemo(() => {
    const parsedRate = Number(rateResponse?.data?.sell?.rate ?? 0);
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      return null;
    }

    return parsedRate;
  }, [rateResponse?.data?.sell?.rate]);

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

  // Responsive values
  const chainLogoMargin = wp(2);
  const chainFontSize = hp(1.8);
  const arrowSize = wp(4);
  const mt8 = hp(2);
  const contentMaxWidth = isLargeScreen ? Math.min(wp(92), 620) : undefined;
  const compactKeyboardLayout = isKeyboardVisible && isSmallScreen;
  const rateRowTopSpacing = compactKeyboardLayout ? hp(1) : mt8 * 1.4;

  const swapCardStyle = {
    backgroundColor: colors.neutral_surface,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: colors.subtle_surface,
    overflow: "hidden" as const,
  };

  return (
    <>
      <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1 }}>
        <AppLayout
          scrollable={false}
          horizontalPadding={false}
          bottomPadding={false}
          statusBarBackgroundColor={colors.canvas_background}
          layoutStyle={{ backgroundColor: colors.canvas_background }}
        >
          <Animated.View
            layout={Layout.springify().damping(18).stiffness(150)}
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(250)}
            style={{ flex: 1 }}
          >
            <SwapFlowWalletPeekLayout
              isWalletPeekOpen={isSmartWalletScreenVisible}
              stepper={
                <SwapFlowStepper
                  activeLabel="Details"
                  trailingDots={2}
                  showActions
                  onWalletPress={() => {
                    if (isKeyboardVisible) {
                      setIsKeyboardVisible(false);
                    }
                    setIsSmartWalletScreenVisible((prev) => !prev);
                  }}
                  onClosePress={() => {
                    if (isSmartWalletScreenVisible) {
                      setIsSmartWalletScreenVisible(false);
                      return;
                    }

                    setIsKeyboardVisible(false);
                  }}
                />
              }
              sheet={
                <LiquidGlassTransition
                  stepKey="details"
                  animationKey={detailsAnimationKey}
                >
                  <SwapScreenSheet
                    header={
                      <SwapChainRow
                        title="Swap"
                        chainName={selectedChain.name}
                        chainLogoUri={selectedChain.logoURI}
                        marginTop={0}
                        onPress={() => {
                          setIsChainSheetVisible(true);
                          setIsKeyboardVisible(false);
                        }}
                        disableChevron={isSmartWalletScreenVisible}
                      />
                    }
                  >
                  <View
                    style={{
                      marginTop: 17,
                      width: "100%",
                      maxWidth: contentMaxWidth,
                      alignSelf: "center",
                    }}
                  >
                    <View>
                      <View style={swapCardStyle}>
                        <View style={{ paddingVertical: 16, gap: 10 }}>
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
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: colors.subtle_surface,
                              width: "100%",
                            }}
                          />
                          <SwapInput
                            value={amount}
                            selectedAssetSymbol={selectedFromAsset?.symbol}
                            fiatDisplay={fiatEstimate}
                            isDisabled={
                              isAssetSheetVisible || isChainSheetVisible
                            }
                            onFocus={() => {
                              setIsKeyboardVisible(true);
                            }}
                          />
                        </View>
                      </View>

                      <View
                        style={{
                          height: 12,
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 22,
                        }}
                      >
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            borderWidth: 0.5,
                            borderColor: colors.subtle_surface,
                            backgroundColor: colors.canvas_background,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ChevronDown size={20} color={colors.secondary} />
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
                        label={
                          selectedFiatOption
                            ? selectedFiatOption.name
                            : "Receive"
                        }
                        subtitle={
                          !selectedFiatOption
                            ? "Select currency"
                            : isRateLoading
                              ? "Fetching rate..."
                              : `Receive ${selectedFiatOption.code}`
                        }
                        rightValue={
                          selectedFiatOption && !isAmountZeroOrEmpty
                            ? fiatEstimate
                            : undefined
                        }
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
                          marginTop: rateRowTopSpacing,
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
                </SwapScreenSheet>
                </LiquidGlassTransition>
              }
            />
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
              setIsKeyboardVisible(true);
            }}
            selectedAssetAddress={selectedFromAsset?.address}
            chainLogoURI={selectedChain.logoURI}
          />
          <ChainSelectorSheet
            isVisible={isChainSheetVisible}
            onClose={() => setIsChainSheetVisible(false)}
            onSelect={(chain) => {
              if (!isSupportedSwapChain(chain, isTestnetMode)) {
                Alert.alert(
                  "Unsupported chain",
                  "This chain is not supported for off-ramp yet.",
                );
                return;
              }

              setSelectedChain(chain);
              if (!isTestnetMode && chain.id === DEFAULT_CHAIN.id) {
                setSelectedFromAsset(DEFAULT_ASSET);
                return;
              }
              setIsKeyboardVisible(true);
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
              setIsKeyboardVisible(true);
            }}
          />

          <BaseSheet
            isVisible={isKeyboardVisible}
            onVisibilityChange={setIsKeyboardVisible}
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

                setLiquidGlassTransition({
                  direction: "forward",
                  variant: "entry",
                });

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
