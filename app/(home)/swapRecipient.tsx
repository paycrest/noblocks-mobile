import {
  verifyPaycrestAccount,
  type VerifyAccountResponse,
} from "@/api/queryFns";
import AddBeneficiaryCard from "@/components/cards/AddBeneficiaryCard";
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
import { ChevronDown, ChevronRight, WalletIcon, X } from "lucide-react-native";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { ActivityIndicator } from "react-native-paper";

import PersonIcon from "@/components/svgs/person-icon";
import _ from "lodash";

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
  const { hp, wp } = useAppDimensions();
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
        <View
          style={{
            flexDirection: "row",
            width: "50%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: wp(3) / 2,
              width: wp(3),
              height: wp(3),
              borderColor: colors.primary,
            }}
          />
          <ResponsiveUi.Text fontSize={hp(1.8)} bold color={colors.primary}>
            Recipient
          </ResponsiveUi.Text>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: wp(3) / 2,
                width: wp(3),
                height: wp(3),
                borderColor: colors.primary,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <WalletIcon style={{ marginRight: wp(4) }} />
          <X color={colors.secondary} onPress={() => router.back()} />
        </View>
      </View>
      {/* Swap Row */}
      <View
        style={{
          flexDirection: "row",
          marginTop: hp(2.5),
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ResponsiveUi.Text
          style={{ marginTop: hp(1) }}
          semiBold
          fontSize={hp(2.2)}
        >
          Swap
        </ResponsiveUi.Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {fromChainLogoUri ? (
            <Image
              source={{ uri: fromChainLogoUri }}
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
            medium
            style={{ marginLeft: wp(2) }}
            fontSize={hp(2.2)}
          >
            {fromChainName}
          </ResponsiveUi.Text>
        </View>
      </View>
      {/* Amount Row */}
      <View
        style={{
          marginTop: hp(2.5),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "40%" }}
        >
          {fromAssetUri ? (
            <Image
              source={{ uri: fromAssetUri }}
              style={{
                width: wp(7),
                height: wp(7),
                borderRadius: wp(3),
                marginRight: wp(2),
              }}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text
            medium
            style={{ marginLeft: wp(3) }}
            fontSize={hp(2.2)}
          >
            ${amount}
          </ResponsiveUi.Text>
        </View>
        <ChevronRight color={colors.secondary} />
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "40%" }}
        >
          {toFiatUri ? (
            <Image
              source={{ uri: toFiatUri }}
              style={{
                width: wp(7),
                height: wp(7),
                borderRadius: wp(3),
                marginRight: wp(2),
              }}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text
            medium
            style={{ marginLeft: wp(3) }}
            fontSize={hp(2.2)}
          >
            {fiatEstimate}
          </ResponsiveUi.Text>
        </View>
      </View>
      {/* Add Recipient Section */}
      <View style={{ marginTop: hp(5), alignItems: "center" }}>
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
            marginTop: hp(5),
            width: "80%",
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
              color={selectedInstitution ? colors.text : colors.secondary}
              fontSize={hp(2.2)}
            >
              {selectedInstitution?.name ?? "Select bank"}
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
            onChangeText={(value) => {
              setAccountIdentifier(value.replace(/[^0-9]/g, ""));
            }}
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
              width: "80%",
              paddingHorizontal: wp(3),
              backgroundColor: colors.subtle_surface,
            }}
            keyboardType="numeric"
          />

          <View style={{ marginTop: hp(5) }}>
            <PersonIcon />
          </View>

          {isVerifyingAccount ? (
            <View
              style={{
                width: "80%",
                marginTop: hp(1.5),
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color={colors.primary} />
              <ResponsiveUi.Text
                fontSize={hp(1.7)}
                color={colors.secondary}
                style={{ marginLeft: wp(2) }}
                center
              >
                Verifying account details...
              </ResponsiveUi.Text>
            </View>
          ) : null}

          {!isVerifyingAccount && resolvedAccountName ? (
            <View style={{ width: "80%", marginTop: hp(1.5) }}>
              <ResponsiveUi.Text
                fontSize={hp(2)}
                medium
                center
                color={colors.text}
              >
                {_.startCase(_.toLower(resolvedAccountName))}
              </ResponsiveUi.Text>
            </View>
          ) : null}

          <View style={{ marginTop: hp(5) }}>
            <AddBeneficiaryCard
              onPress={() => setIsBeneficiaryModalVisible(true)}
            />
          </View>
          {!isVerifyingAccount && accountVerificationError ? (
            <View style={{ width: "80%", marginTop: hp(1) }}>
              <ResponsiveUi.Text fontSize={hp(1.7)} color={colors.secondary}>
                {accountVerificationError}
              </ResponsiveUi.Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 15, paddingHorizontal: wp(4) }}>
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
