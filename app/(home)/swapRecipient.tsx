import {
  verifyPaycrestAccount,
  type VerifyAccountResponse,
} from "@/api/queryFns";
import AddBeneficiaryCard from "@/components/cards/AddBeneficiaryCard";
import Check from "@/components/Check";
import SwapChainRow from "@/components/cards/SwapChainRow";
import AppLayout from "@/components/layouts/AppLayout";
import BeneficiarySelectorModal, {
  type BeneficiaryItem,
} from "@/components/modals/BeneficiarySelectorModal";
import InstitutionSelectorModal, {
  PaycrestInstitution,
} from "@/components/modals/InstitutionSelectorModal";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import AmountPillIcon from "@/components/swap/AmountPillIcon";
import SwapFlowStepper from "@/components/swap/SwapFlowStepper";
import SwapScreenSheet from "@/components/swap/SwapScreenSheet";
import PersonIcon from "@/components/svgs/person-icon";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import _, { truncate } from "lodash";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACCOUNT_NUMBER_LENGTH = 10;
const ACCOUNT_VERIFICATION_DELAY_MS = 500;
const CONTENT_MAX_WIDTH = 361;
const SWAP_ROW_MAX_WIDTH = 353;

const getVerifiedAccountName = (response: VerifyAccountResponse) => {
  if (typeof response.data === "string") {
    return response.data;
  }

  return (
    response.data?.accountName ??
    response.data?.account_name ??
    response.data?.name ??
    null
  );
};

const getAccountVerificationErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 504
  ) {
    return "Account not found, check the account details";
  }

  return error instanceof Error
    ? error.message
    : "Account verification failed. Please try again.";
};

const SwapDetails: FunctionComponent = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [isInstitutionModalVisible, setIsInstitutionModalVisible] =
    useState(false);
  const [isBeneficiaryModalVisible, setIsBeneficiaryModalVisible] =
    useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<PaycrestInstitution | null>(null);
  const [accountIdentifier, setAccountIdentifier] = useState("");
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(
    null,
  );
  const [accountVerificationError, setAccountVerificationError] = useState<
    string | null
  >(null);
  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const {
    beneficiaries,
    isLoading: isLoadingBeneficiaries,
    saveBeneficiary,
  } = useBeneficiaries();
  const {
    mutateAsync: verifyAccount,
    isPending: isVerifyingAccount,
    reset: resetVerifyAccount,
  } = useMutation({
    mutationFn: verifyPaycrestAccount,
  });
  const {
    amount,
    fromChainKey,
    fromChainName,
    fromChainId,
    fromChainLogoUri,
    fromAssetAddress,
    fromAssetUri,
    fromAssetSymbol,
    fromAssetName,
    toFiatCode,
    toFiatUri,
    rate,
    fiatEstimate,
  } = useLocalSearchParams<{
    amount?: string;
    fromChainKey?: string;
    fromChainName?: string;
    fromChainId?: string;
    fromChainLogoUri?: string;
    fromAssetAddress?: string;
    fromAssetUri?: string;
    fromAssetSymbol?: string;
    fromAssetName?: string;
    toFiatCode?: string;
    toFiatUri?: string;
    rate?: string;
    fiatEstimate?: string;
  }>();

  const contentMaxWidth = CONTENT_MAX_WIDTH;

  const recipientCurrencyCode = useMemo(() => {
    if (!toFiatCode) {
      return "NGN";
    }

    return String(toFiatCode).toUpperCase();
  }, [toFiatCode]);

  const normalizedAccountIdentifier = useMemo(() => {
    return accountIdentifier.replace(/\s/g, "");
  }, [accountIdentifier]);

  const canVerifyAccount =
    Boolean(selectedInstitution) &&
    normalizedAccountIdentifier.length === ACCOUNT_NUMBER_LENGTH;

  const verifySelectedAccount = useCallback(
    async ({
      institutionCode,
      accountNumber,
      isActive,
    }: {
      institutionCode: string;
      accountNumber: string;
      isActive: () => boolean;
    }) => {
      setResolvedAccountName(null);
      setAccountVerificationError(null);

      try {
        const response = await verifyAccount({
          institution: institutionCode,
          accountIdentifier: accountNumber,
        });

        if (!isActive()) {
          return;
        }

        const displayName = getVerifiedAccountName(response);

        if (!displayName) {
          setResolvedAccountName(null);
          setAccountVerificationError("Could not resolve account name.");
          return;
        }

        setResolvedAccountName(displayName);
      } catch (error: unknown) {
        if (!isActive()) {
          return;
        }

        setResolvedAccountName(null);
        setAccountVerificationError(getAccountVerificationErrorMessage(error));
      }
    },
    [verifyAccount],
  );

  const handleSelectBeneficiary = useCallback(
    (beneficiary: BeneficiaryItem) => {
      setSelectedInstitution({
        code: beneficiary.institutionCode,
        name: beneficiary.bankName,
        type: "bank",
      });
      setAccountIdentifier(beneficiary.accountNumber);
      setResolvedAccountName(beneficiary.name);
      setAccountVerificationError(null);
      setAddToBeneficiaries(false);
    },
    [],
  );

  const handleContinue = useCallback(async () => {
    if (!resolvedAccountName || !selectedInstitution) {
      return;
    }

    if (addToBeneficiaries) {
      await saveBeneficiary({
        name: resolvedAccountName,
        accountNumber: normalizedAccountIdentifier,
        bankName: selectedInstitution.name,
        institutionCode: selectedInstitution.code,
        currencyCode: recipientCurrencyCode,
      });
    }

    router.push({
      pathname: "/(home)/reviewTransaction",
      params: {
        amount,
        fromChainKey,
        fromChainName,
        fromChainId,
        fromChainLogoUri,
        fromAssetAddress,
        fromAssetUri,
        fromAssetSymbol,
        fromAssetName,
        toFiatCode,
        toFiatUri,
        rate,
        fiatEstimate,
        recipientInstitutionCode: selectedInstitution.code,
        recipientInstitutionName: selectedInstitution.name,
        recipientAccountNumber: normalizedAccountIdentifier,
        recipientAccountName: resolvedAccountName,
      },
    });
  }, [
    addToBeneficiaries,
    amount,
    fiatEstimate,
    fromAssetAddress,
    fromAssetName,
    fromAssetSymbol,
    fromAssetUri,
    fromChainId,
    fromChainKey,
    fromChainLogoUri,
    fromChainName,
    normalizedAccountIdentifier,
    rate,
    recipientCurrencyCode,
    resolvedAccountName,
    saveBeneficiary,
    selectedInstitution,
    toFiatCode,
    toFiatUri,
  ]);

  const handleAccountIdentifierChange = useCallback((value: string) => {
    setAccountIdentifier(value.replace(/[^0-9]/g, ""));
  }, []);

  useEffect(() => {
    if (!selectedInstitution || !canVerifyAccount) {
      setResolvedAccountName(null);
      setAccountVerificationError(null);
      resetVerifyAccount();
      return;
    }

    let isActive = true;

    const timeout = setTimeout(() => {
      void verifySelectedAccount({
        institutionCode: selectedInstitution.code,
        accountNumber: normalizedAccountIdentifier,
        isActive: () => isActive,
      });
    }, ACCOUNT_VERIFICATION_DELAY_MS);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [
    canVerifyAccount,
    normalizedAccountIdentifier,
    resetVerifyAccount,
    selectedInstitution,
    verifySelectedAccount,
  ]);

  const selectedInstitutionName = selectedInstitution?.name ?? "Select bank";
  const isInstitutionSelected = Boolean(selectedInstitution);

  const verificationMessage = isVerifyingAccount
    ? "Verifying account details..."
    : resolvedAccountName
      ? _.startCase(_.toLower(resolvedAccountName))
      : accountVerificationError;

  const showVerificationMessage = Boolean(verificationMessage);
  const verificationTextColor = resolvedAccountName
    ? colors.text
    : colors.secondary;

  const amountPillStyle = {
    flex: 1,
    height: 52,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: colors.neutral_surface,
    borderWidth: 0.5,
    borderColor: colors.subtle_surface,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 20,
    paddingVertical: 12,
  };

  return (
    <AppLayout
      scrollable={false}
      horizontalPadding={false}
      bottomPadding={false}
      directChild
      statusBarBackgroundColor={colors.canvas_background}
      layoutStyle={{ backgroundColor: colors.canvas_background }}
    >
      <View style={{ flex: 1, backgroundColor: colors.canvas_background }}>
        <View style={{ paddingTop: 8, paddingHorizontal: 16 }}>
          <SwapFlowStepper
            activeLabel="Recipient"
            leadingDots={1}
            trailingDots={1}
            showActions
            onWalletPress={() => router.push("/(tabs)/wallet")}
            onClosePress={() => router.navigate("/(tabs)")}
          />
        </View>

        <SwapScreenSheet
          style={{
            flex: 1,
            marginTop: 8,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <View
                style={{
                  width: "100%",
                  maxWidth: contentMaxWidth,
                  alignSelf: "center",
                  gap: 20,
                }}
              >
              <View style={{ maxWidth: SWAP_ROW_MAX_WIDTH, width: "100%" }}>
                <SwapChainRow
                  title="Swap"
                  chainName={fromChainName}
                  chainLogoUri={fromChainLogoUri}
                  isStatic
                  showChevron={false}
                  marginTop={0}
                />
              </View>

              <View style={{ position: "relative" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View style={amountPillStyle}>
                    <AmountPillIcon
                      symbol={fromAssetSymbol}
                      uri={fromAssetUri}
                      size={24}
                    />
                    <ResponsiveUi.Text medium fontSize={16} numberOfLines={1}>
                      ${truncate(amount ?? "0", { length: 12 })}
                    </ResponsiveUi.Text>
                  </View>

                  <View style={amountPillStyle}>
                    {toFiatUri ? (
                      <Image
                        source={{ uri: toFiatUri }}
                        style={{ width: 24, height: 24, borderRadius: 12 }}
                        contentFit="cover"
                      />
                    ) : (
                      <AmountPillIcon symbol={recipientCurrencyCode} size={24} />
                    )}
                    <ResponsiveUi.Text medium fontSize={16} numberOfLines={1}>
                      {truncate(fiatEstimate ?? "0", { length: 14 })}
                    </ResponsiveUi.Text>
                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    marginLeft: -10,
                    marginTop: -10,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: colors.subtle_surface,
                    backgroundColor: colors.surface_canvas,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRight size={16} color={colors.secondary} />
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  borderRadius: 32,
                  backgroundColor: colors.neutral_surface,
                  paddingTop: 16,
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                  gap: 12,
                }}
              >
                <ResponsiveUi.Text
                  medium
                  fontSize={16}
                  color={colors.text}
                  center
                >
                  Add recipient
                </ResponsiveUi.Text>

                <View style={{ marginTop: 34, gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      height: 48,
                      borderWidth: 0.5,
                      borderColor: colors.subtle_surface,
                      backgroundColor: colors.neutral_surface,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                    activeOpacity={0.85}
                    onPress={() => setIsInstitutionModalVisible(true)}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 8,
                      }}
                    >
                      {selectedInstitution?.logoURI ? (
                        <Image
                          source={{ uri: selectedInstitution.logoURI }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginRight: 8,
                          }}
                          contentFit="cover"
                        />
                      ) : null}
                      <ResponsiveUi.Text
                        color={
                          isInstitutionSelected
                            ? colors.text
                            : colors.place_holder
                        }
                        medium
                        fontSize={16}
                        numberOfLines={1}
                      >
                        {selectedInstitutionName}
                      </ResponsiveUi.Text>
                    </View>
                    <ChevronDown size={18} color={colors.secondary} />
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Account number"
                    placeholderTextColor={colors.place_holder}
                    value={accountIdentifier}
                    onChangeText={handleAccountIdentifierChange}
                    maxLength={ACCOUNT_NUMBER_LENGTH}
                    style={{
                      color: colors.text,
                      borderColor: colors.subtle_surface,
                      fontFamily: "Inter_500Medium",
                      borderRadius: 16,
                      borderWidth: 0.5,
                      fontSize: 16,
                      height: 48,
                      paddingHorizontal: 20,
                      backgroundColor: colors.neutral_surface,
                    }}
                    keyboardType="numeric"
                  />
                </View>

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: resolvedAccountName ? 12 : 32,
                    minHeight: resolvedAccountName ? undefined : 140,
                  }}
                >
                  {showVerificationMessage ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 12,
                      }}
                    >
                      {isVerifyingAccount ? (
                        <ActivityIndicator
                          size={16}
                          color={colors.primary}
                          style={{ marginRight: 8 }}
                        />
                      ) : null}
                      <ResponsiveUi.Text
                        fontSize={resolvedAccountName ? 16 : 14}
                        color={verificationTextColor}
                        medium={Boolean(resolvedAccountName)}
                        center
                      >
                        {verificationMessage}
                      </ResponsiveUi.Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: colors.gray2,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PersonIcon
                        height={39}
                        width={39}
                        color={colors.gray_hover}
                        color2={colors.secondary}
                      />
                    </View>
                  )}
                </View>

                {resolvedAccountName ? (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setAddToBeneficiaries((value) => !value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Check
                      checked={addToBeneficiaries}
                      type="square"
                      onPress={() => setAddToBeneficiaries((value) => !value)}
                    />
                    <ResponsiveUi.Text medium fontSize={14} color={colors.text}>
                      Save beneficiary for later
                    </ResponsiveUi.Text>
                  </TouchableOpacity>
                ) : null}

                <AddBeneficiaryCard
                  onPress={() => setIsBeneficiaryModalVisible(true)}
                />
              </View>
            </View>
            </ScrollView>

            <View
              style={{
                paddingTop: 24,
                paddingBottom: Math.max(insets.bottom, 16),
                width: "100%",
                maxWidth: contentMaxWidth,
                alignSelf: "center",
              }}
            >
              <ResponsiveUi.Button
                action={() => {
                  void handleContinue();
                }}
                disabled={!resolvedAccountName}
                backgroundColor={colors.slate}
                style={{ width: "100%", height: 52, borderRadius: 50 }}
                title="Continue"
                semiBold
                fontSize={18}
              />
            </View>
          </View>
        </SwapScreenSheet>
      </View>

      <InstitutionSelectorModal
        isVisible={isInstitutionModalVisible}
        onClose={() => setIsInstitutionModalVisible(false)}
        currencyCode={recipientCurrencyCode}
        selectedCode={selectedInstitution?.code}
        onSelect={setSelectedInstitution}
      />
      <BeneficiarySelectorModal
        isVisible={isBeneficiaryModalVisible}
        onClose={() => setIsBeneficiaryModalVisible(false)}
        onSelect={handleSelectBeneficiary}
        beneficiaries={beneficiaries}
        isLoading={isLoadingBeneficiaries}
      />
    </AppLayout>
  );
};

export default SwapDetails;
