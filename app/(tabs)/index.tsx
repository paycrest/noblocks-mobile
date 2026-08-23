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
import AssetSelectorSheet from "@/components/modals/AssetSelectorSheet";
import type { LifiToken } from "@/api/queryTypes";
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
import { formatCurrencyAmount, parseAmountValue, sanitizeAmountInput, truncateDecimalPlaces } from "@/utils/general";
import { setLiquidGlassTransition } from "@/lib/transitions/liquidGlassNavigation";
import { getReferenceRateQuoteAmount } from "@/lib/paycrest/rateQuote";
import { resolveDefaultSwapToken } from "@/lib/wallet/supportedSwapTokens";
import {
  formatTokenUsdEstimate,
  isUsdPeggedStablecoin,
} from "@/lib/wallet/tokenUsdValue";
import { useWalletAddress } from "@/hooks/useWalletAddress";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
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
  const [amount, setAmount] = useState(sanitizeAmountInput(swapDraftAmount || ""));
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
  const walletAddress = useWalletAddress();
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

  const referenceRateAmount = useMemo(
    () => getReferenceRateQuoteAmount(selectedFromAsset?.symbol),
    [selectedFromAsset?.symbol],
  );

  const isAtMaxAmount = useMemo(() => {
    if (!maxSendAmount || maxSendAmount === "0") {
      return false;
    }

    const parsedAmount = parseAmountValue(amount);
    const parsedMax = parseAmountValue(maxSendAmount);

    if (!Number.isFinite(parsedAmount) || !Number.isFinite(parsedMax)) {
      return false;
    }

    return parsedAmount >= parsedMax;
  }, [amount, maxSendAmount]);

  const exceedsBalance = useMemo(() => {
    if (!maxSendAmount || maxSendAmount === "0") {
      return false;
    }

    const parsedAmount = parseAmountValue(amount);
    const parsedMax = parseAmountValue(maxSendAmount);

    if (!Number.isFinite(parsedAmount) || !Number.isFinite(parsedMax)) {
      return false;
    }

    return parsedAmount > parsedMax;
  }, [amount, maxSendAmount]);

  const isUseMaxDisabled =
    !maxSendAmount ||
    maxSendAmount === "0" ||
    isAtMaxAmount;

  const { data: rateResponse, isLoading: isRateLoading } = useQuery({
    queryKey: [
      "paycrest",
      "rate",
      selectedRateNetwork,
      selectedRateToken,
      selectedRateFiat,
      referenceRateAmount,
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
        referenceRateAmount,
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

  const needsUsdcFiatReference =
    Boolean(selectedFromAsset) &&
    !isUsdPeggedStablecoin(selectedFromAsset?.symbol) &&
    !selectedFromAsset?.priceUSD;

  const { data: usdcRateResponse } = useQuery({
    queryKey: [
      "paycrest",
      "rate",
      selectedRateNetwork,
      "usdc",
      selectedRateFiat,
      1,
      "sell",
      "usd-reference",
    ],
    enabled: Boolean(
      needsUsdcFiatReference &&
        selectedRateNetwork &&
        selectedRateFiat,
    ),
    queryFn: async () => {
      return fetchPaycrestRate(
        selectedRateNetwork!,
        "usdc",
        selectedRateFiat!,
        1,
        "sell",
      );
    },
    staleTime: RATE_QUERY_STALE_TIME_MS,
  });

  const usdcFiatRate = useMemo(() => {
    const parsedRate = Number(usdcRateResponse?.data?.sell?.rate ?? 0);
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      return null;
    }

    return parsedRate;
  }, [usdcRateResponse?.data?.sell?.rate]);

  const usdEstimate = useMemo(() => {
    return formatTokenUsdEstimate(amount, {
      symbol: selectedFromAsset?.symbol,
      priceUSD: selectedFromAsset?.priceUSD,
      tokenFiatRate: activeRate,
      usdcFiatRate,
    });
  }, [amount, selectedFromAsset, activeRate, usdcFiatRate]);

  const isAmountZeroOrEmpty = useMemo(() => {
    const normalizedAmount = amount.trim();
    if (!normalizedAmount) {
      return true;
    }

    const parsedAmount = parseAmountValue(normalizedAmount);
    if (!Number.isFinite(parsedAmount)) {
      return true;
    }

    return parsedAmount <= 0;
  }, [amount]);

  useEffect(() => {
    if (!_hasHydrated || didRestoreDraft) {
      return;
    }

    if (swapDraftAmount) {
      setAmount(sanitizeAmountInput(swapDraftAmount));
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
    const numericAmount = parseAmountValue(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !activeRate) {
      setFiatEstimate("0");
      return;
    }

    const estimatedValue = numericAmount * activeRate;
    setFiatEstimate(formatCurrencyAmount(estimatedValue));
  }, [amount, activeRate]);

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

  const dismissKeyboard = useCallback(() => {
    setIsKeyboardVisible(false);
  }, []);

  const showKeyboard = useCallback(() => {
    setIsKeyboardVisible(true);
  }, []);

  const dismissKeyboardOnBackgroundPress = useCallback(() => {
    if (isKeyboardVisible) {
      dismissKeyboard();
    }
  }, [dismissKeyboard, isKeyboardVisible]);

  useEffect(() => {
    if (!isFocused) {
      dismissKeyboard();
    }
  }, [dismissKeyboard, isFocused]);

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
            style={{ flex: 1, position: "relative" }}
          >
            <SwapFlowWalletPeekLayout
              isWalletPeekOpen={isSmartWalletScreenVisible}
              stepper={
                <Pressable onPress={dismissKeyboardOnBackgroundPress}>
                  <SwapFlowStepper
                    activeLabel="Details"
                    trailingDots={isKeyboardVisible ? 2 : 3}
                    showActions={isKeyboardVisible}
                    onWalletPress={() => {
                      if (isKeyboardVisible) {
                        dismissKeyboard();
                      }
                      setIsSmartWalletScreenVisible((prev) => !prev);
                    }}
                    onClosePress={() => {
                      if (isSmartWalletScreenVisible) {
                        setIsSmartWalletScreenVisible(false);
                        return;
                      }

                      dismissKeyboard();
                    }}
                  />
                </Pressable>
              }
              sheet={
                <LiquidGlassTransition
                  stepKey="details"
                  animationKey={detailsAnimationKey}
                >
                  <SwapScreenSheet
                    header={
                      <Pressable onPress={dismissKeyboardOnBackgroundPress}>
                        <SwapChainRow
                          title="Swap"
                          chainName={selectedChain.name}
                          chainLogoUri={selectedChain.logoURI}
                          marginTop={0}
                          onPress={() => {
                            setIsChainSheetVisible(true);
                            dismissKeyboard();
                          }}
                          disableChevron={isSmartWalletScreenVisible}
                        />
                      </Pressable>
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
                          <Pressable onPress={dismissKeyboardOnBackgroundPress}>
                            <WalletBalance
                              selectedAsset={selectedFromAsset}
                              chainLogoURI={selectedChain.logoURI}
                              privyBalanceLabel={sendAssetBalanceLabel}
                              isUseMaxDisabled={isUseMaxDisabled}
                              onUseMaxPress={() => {
                                if (isUseMaxDisabled) {
                                  return;
                                }

                                if (!maxSendAmount || maxSendAmount === "0") {
                                  Alert.alert(
                                    "No balance",
                                    "No available balance for the selected asset.",
                                  );
                                  return;
                                }

                                setAmount(truncateDecimalPlaces(maxSendAmount));
                              }}
                              onAssetPress={() => {
                                setIsAssetSheetVisible(true);
                                dismissKeyboard();
                              }}
                            />
                          </Pressable>
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
                            usdDisplay={usdEstimate}
                            exceedsBalance={exceedsBalance}
                            isDisabled={
                              isAssetSheetVisible ||
                              isChainSheetVisible ||
                              isFiatModalVisible ||
                              isSmartWalletScreenVisible
                            }
                            onFocus={showKeyboard}
                          />
                        </View>
                      </View>

                      <Pressable onPress={dismissKeyboardOnBackgroundPress}>
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
                          dismissKeyboard();
                        }}
                      />
                      </Pressable>
                    </View>
                    {selectedFiatOption && (
                      <Pressable onPress={dismissKeyboardOnBackgroundPress}>
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
                            ? `${formatCurrencyAmount(activeRate)} ${selectedFiatOption?.code}`
                            : "N/A"}
                        </ResponsiveUi.Text>
                      </View>
                      </Pressable>
                    )}
                  </View>
                </SwapScreenSheet>
                </LiquidGlassTransition>
              }
            />
            {!isFocused || isSmartWalletScreenVisible || !isKeyboardVisible ? null : (
              <View
                pointerEvents="box-none"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 200,
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.neutral_surface,
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    borderWidth: 0.5,
                    borderBottomWidth: 0,
                    borderColor: colors.subtle_surface,
                  }}
                >
                  <CustomKeyBoard
                    value={amount}
                    onChangeText={(value) =>
                      setAmount(sanitizeAmountInput(value))
                    }
                    onDismiss={dismissKeyboard}
                    onSubmit={() => {
                      if (
                        isAmountZeroOrEmpty ||
                        exceedsBalance ||
                        !selectedFromAsset ||
                        !selectedFiatOption
                      ) {
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
                          rate:
                            activeRate !== null ? String(activeRate) : "",
                          fiatEstimate,
                          usdEstimate,
                        },
                      });
                      dismissKeyboard();
                    }}
                    submitLabel="Continue"
                    submitDisabled={
                      isAmountZeroOrEmpty ||
                      exceedsBalance ||
                      !selectedFromAsset ||
                      !selectedFiatOption ||
                      !selectedChain
                    }
                  />
                </View>
              </View>
            )}
          </Animated.View>
        </AppLayout>
      </Animated.View>
      {!isSmartWalletScreenVisible && (
        <>
          <AssetSelectorSheet
            chainId={selectedChain.id}
            chainKey={selectedChain.key}
            isVisible={isAssetSheetVisible}
            onClose={() => setIsAssetSheetVisible(false)}
            onSelect={(asset) => {
              setSelectedFromAsset(asset);
              setAmount("");
              setIsAssetSheetVisible(false);
              showKeyboard();
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
              setAmount("");
              showKeyboard();
              setSelectedFromAsset(null);

              void resolveDefaultSwapToken(chain, walletAddress).then(
                (asset) => {
                  setSelectedFromAsset(asset);
                },
              );
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
              showKeyboard();
            }}
          />
        </>
      )}
    </>
  );
}
