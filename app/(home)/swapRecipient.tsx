import {
  verifyPaycrestAccount,
  type VerifyAccountResponse,
} from "@/api/queryFns";
import AddBeneficiaryCard from "@/components/cards/AddBeneficiaryCard";
import SwapChainRow from "@/components/cards/SwapChainRow";
import AppLayout from "@/components/layouts/AppLayout";
import BeneficiarySelectorModal, {
  type BeneficiaryItem,
} from "@/components/modals/BeneficiarySelectorModal";
import InstitutionSelectorModal, {
  PaycrestInstitution,
} from "@/components/modals/InstitutionSelectorModal";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import WalletIcon from "@/components/svgs/wallet";
import { ChevronDown, ChevronRight, X } from "lucide-react-native";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { ActivityIndicator } from "react-native-paper";
import { Checkbox } from "expo-checkbox";

import PersonIcon from "@/components/svgs/person-icon";
import _, { capitalize, truncate } from "lodash";

const ACCOUNT_NUMBER_LENGTH = 10;
const ACCOUNT_VERIFICATION_DELAY_MS = 500;

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
  const { hp, wp, isSmallScreen, isLargeScreen } = useAppDimensions();
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
      setResolvedAccountName(beneficiary.name);
      setAccountVerificationError(null);
    },
    [],
  );

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

  const walletDotSize = wp(3.5);
  const walletDotMargin = wp(1.2);
  const progressHeaderWidth = isSmallScreen ? wp(48) : wp(40);
  const recipientContentWidth = isLargeScreen ? Math.min(wp(82), 520) : wp(100);
  const recipientControlWidth = isSmallScreen ? "92%" : "80%";
  const amountValueFontSize = isSmallScreen ? hp(1.8) : hp(2);
  const sectionBottomSpacing = isSmallScreen ? hp(2.5) : hp(2);

  const walletDotStyle = {
    borderWidth: 1,
    borderRadius: walletDotSize / 2,
    width: walletDotSize,
    height: walletDotSize,
    borderColor: colors.primary,
  };

  const amountPillStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
    backgroundColor: colors.neutral_surface,
    borderWidth: 1,
    borderColor: colors.subtle_surface,
    justifyContent: "space-between" as const,
    paddingHorizontal: wp(3),
    paddingVertical: isSmallScreen ? hp(1.1) : hp(1.5),
    borderRadius: 16,
  };

  const assetLogoStyle = {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3),
    marginRight: wp(2),
  };

  const selectedInstitutionName = selectedInstitution?.name ?? "Select bank";
  const isInstitutionSelected = Boolean(selectedInstitution);

  const verificationMessage = isVerifyingAccount
    ? "Verifying account details..."
    : resolvedAccountName
      ? _.startCase(_.toLower(resolvedAccountName))
      : accountVerificationError;

  const showVerificationMessage = Boolean(verificationMessage);
  const verificationFontSize = resolvedAccountName ? hp(2) : hp(1.7);
  const verificationTextColor = resolvedAccountName
    ? colors.text
    : colors.secondary;
  const beneficiaryFirstName = resolvedAccountName
    ? _.head(_.split(_.trim(resolvedAccountName), " "))
    : null;
  const [addToBeneficiaries, setAddToBeneficiaries] = useState(false);
  const appTheme = useColorScheme();

  return (
    <AppLayout>
      {/* Progress Row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            className="flex-row justify-between items-center"
            style={{ width: progressHeaderWidth }}
          >
            <View style={walletDotStyle} />
            <View
              style={{
                backgroundColor: colors.primary_2,
                borderRadius: 16,
                paddingVertical: isSmallScreen ? hp(0.35) : hp(0.5),
                paddingHorizontal: isSmallScreen ? wp(2.5) : wp(3),
                marginHorizontal: 5,
              }}
            >
              <ResponsiveUi.Text
                medium
                color={colors.primary}
                fontSize={isSmallScreen ? hp(2) : hp(2.3)}
              >
                Recipient
              </ResponsiveUi.Text>
            </View>
            <View style={[walletDotStyle, { marginLeft: walletDotMargin }]} />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <WalletIcon style={{ marginRight: wp(4) }} />
          <X color={colors.secondary} onPress={() => router.back()} />
        </View>
      </View>
      <SwapChainRow
        title="Swap"
        chainName={fromChainName}
        chainLogoUri={fromChainLogoUri}
        isStatic
        showChevron={false}
        marginTop={hp(4.5)}
      />
      {/* Amount Row */}
      <View
        style={{
          marginTop: hp(2.5),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: wp(2),
          width: recipientContentWidth,
          alignSelf: "center",
        }}
      >
        <View style={amountPillStyle}>
          {fromAssetUri ? (
            <Image
              source={{ uri: fromAssetUri }}
              style={assetLogoStyle}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text
            medium
            style={{ marginLeft: wp(1), flex: 1, textAlign: "right" }}
            fontSize={amountValueFontSize}
            numberOfLines={1}
          >
            ${truncate(amount ?? "0", { length: 10 })}
          </ResponsiveUi.Text>
        </View>
        <View className="bg-neutral_surface border border-subtle_surface p-1 rounded-full">
          <ChevronRight color={colors.secondary} />
        </View>
        <View style={amountPillStyle}>
          {toFiatUri ? (
            <Image
              source={{ uri: toFiatUri }}
              style={assetLogoStyle}
              contentFit="fill"
            />
          ) : null}
          <ResponsiveUi.Text
            medium
            style={{ marginLeft: wp(1), flex: 1, textAlign: "right" }}
            fontSize={amountValueFontSize}
            numberOfLines={1}
          >
            {truncate(`${fiatEstimate ?? "0"}`, {
              length: 15,
            })}
          </ResponsiveUi.Text>
        </View>
      </View>
      {/* Add Recipient Section */}
      <View
        style={{
          marginTop: hp(2),
          alignItems: "center",
          backgroundColor: colors.neutral_surface,
          paddingHorizontal: wp(2),
          paddingVertical: isSmallScreen ? hp(2.4) : hp(3),
          borderRadius: 16,
          width: recipientContentWidth,
          alignSelf: "center",
          marginBottom: sectionBottomSpacing,
        }}
      >
        <ResponsiveUi.Text
          semiBold
          style={{ marginLeft: wp(3) }}
          fontSize={hp(2)}
          color={colors.text}
        >
          Add recipient
        </ResponsiveUi.Text>
        <TouchableOpacity
          style={{
            marginTop: hp(3),
            width: recipientControlWidth,
            borderWidth: 0.5,
            borderColor: colors.secondary,
            backgroundColor: colors.subtle_surface,
            borderRadius: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: hp(6.5),
            paddingHorizontal: wp(3),
          }}
          activeOpacity={0.85}
          onPress={() => setIsInstitutionModalVisible(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {selectedInstitution?.logoURI ? (
              <Image
                source={{ uri: selectedInstitution.logoURI }}
                style={{
                  width: wp(6),
                  height: wp(6),
                  borderRadius: wp(3),
                  marginRight: wp(2),
                }}
                contentFit="cover"
              />
            ) : null}
            <ResponsiveUi.Text
              color={isInstitutionSelected ? colors.text : colors.secondary}
              fontSize={hp(2.2)}
            >
              {selectedInstitutionName}
            </ResponsiveUi.Text>
          </View>
          <ChevronDown color={colors.secondary} />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            marginTop: hp(2.5),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Account number"
            placeholderTextColor={colors.place_holder}
            value={accountIdentifier}
            onChangeText={handleAccountIdentifierChange}
            maxLength={ACCOUNT_NUMBER_LENGTH}
            style={{
              color: colors.text,
              borderColor: colors.secondary,
              fontWeight: "500",
              borderRadius: 16,
              borderWidth: 0.5,
              fontSize: hp(2.2),
              lineHeight: hp(2.7),
              height: hp(6.5),
              width: recipientControlWidth,
              paddingHorizontal: wp(3),
              backgroundColor: colors.subtle_surface,
            }}
            keyboardType="numeric"
          />

          <View
            style={{
              marginTop: hp(2),
              borderWidth: 1,
              borderColor: colors.subtle_surface,
              padding: wp(3),
              borderRadius: 100,
            }}
          >
            <PersonIcon
              height={35}
              width={35}
              color={!resolvedAccountName ? colors.gray_hover : colors.primary}
              color2={!resolvedAccountName ? colors.secondary : colors.white}
            />
          </View>

          <View
            style={{
              width: recipientControlWidth,
              marginTop: hp(1.5),
              minHeight: hp(3),
              justifyContent: "center",
            }}
          >
            {showVerificationMessage ? (
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: resolvedAccountName ? 0.5 : 0,
                  borderColor:
                    appTheme === "dark" ? colors.destructive : colors.white,
                  borderRadius: 8,
                  paddingHorizontal: resolvedAccountName ? wp(0.5) : 0,
                  paddingVertical: resolvedAccountName ? hp(0.5) : 0,
                }}
              >
                {isVerifyingAccount ? (
                  <ActivityIndicator size={15} color={colors.primary} />
                ) : null}
                <ResponsiveUi.Text
                  fontSize={verificationFontSize}
                  color={verificationTextColor}
                  style={isVerifyingAccount ? { marginLeft: wp(2) } : undefined}
                  semiBold={Boolean(resolvedAccountName)}
                  center
                >
                  {verificationMessage}
                </ResponsiveUi.Text>
              </View>
            ) : null}
          </View>

          {resolvedAccountName ? (
            <View
              className="mt-3"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Checkbox
                style={{
                  margin: 8,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: colors.secondary,
                }}
                value={addToBeneficiaries}
                onValueChange={setAddToBeneficiaries}
                color={addToBeneficiaries ? colors.primary : undefined}
              />
              <ResponsiveUi.Text fontSize={12}>
                Add {capitalize(beneficiaryFirstName ?? "")} to your
                beneficiaries
              </ResponsiveUi.Text>
            </View>
          ) : null}
          <View style={{ marginTop: hp(1) }}>
            <AddBeneficiaryCard
              onPress={() => setIsBeneficiaryModalVisible(true)}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: hp(2),
          paddingHorizontal: wp(4),
        }}
      >
        <ResponsiveUi.Button
          action={() =>
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
                recipientInstitutionCode: selectedInstitution?.code,
                recipientInstitutionName: selectedInstitution?.name,
                recipientAccountNumber: normalizedAccountIdentifier,
                recipientAccountName: resolvedAccountName,
              },
            })
          }
          disabled={!resolvedAccountName}
          style={{ width: "100%" }}
          title="Continue"
          fontSize={hp(2)}
        />
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
      />
    </AppLayout>
  );
};

export default SwapDetails;
