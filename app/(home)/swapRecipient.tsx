import {
  verifyPaycrestAccount,
  type VerifyAccountResponse,
} from "@/api/queryFns";
import AppLayout from "@/components/layouts/AppLayout";
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
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  return error instanceof Error
    ? error.message
    : "Account verification failed. Please try again.";
};

const SwapDetails: FunctionComponent = () => {
  const colors = useThemeColors();
  const [isInstitutionModalVisible, setIsInstitutionModalVisible] =
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
      <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center  ">
          <ResponsiveUi.Text bold color={colors.primary}>
            Details
          </ResponsiveUi.Text>
          <View className="ml-8 flex-row">
            <View className="border rounded-full w-3 h-3 border-primary" />
            <View className="border rounded-full w-3 h-3 ml-2 border-primary" />
          </View>
        </View>
        <View className="flex-row items-center  ">
          <WalletIcon className="mr-8" />
          <X color={colors.secondary} onPress={() => router.back()} />
        </View>
      </View>
      <View className="flex-row mt-8 items-center justify-between">
        <ResponsiveUi.Text className="mt-4" semiBold fontSize={18}>
          Swap
        </ResponsiveUi.Text>
        <View className="flex-row items-center">
          {fromChainLogoUri ? (
            <Image
              source={{ uri: fromChainLogoUri }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                marginRight: 8,
              }}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text medium className="ml-4" fontSize={18}>
            {fromChainName}
          </ResponsiveUi.Text>
        </View>
      </View>
      <View className="mt-8 flex-row items-center justify-between">
        <View className="flex-row items-center w-2/5 ">
          {fromAssetUri ? (
            <Image
              source={{ uri: fromAssetUri }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 10,
                marginRight: 8,
              }}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text medium tailwind="ml-8" fontSize={18}>
            ${amount}
          </ResponsiveUi.Text>
        </View>
        <ChevronRight color={colors.secondary} />
        <View className="flex-row items-center w-2/5 ">
          {toFiatUri ? (
            <Image
              source={{ uri: toFiatUri }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 10,
                marginRight: 8,
              }}
              contentFit="cover"
            />
          ) : null}
          <ResponsiveUi.Text medium tailwind="ml-8" fontSize={18}>
            {fiatEstimate}
          </ResponsiveUi.Text>
        </View>
      </View>
      <View className="mt-8 items-center">
        <ResponsiveUi.Text
          semiBold
          tailwind="ml-8"
          fontSize={16}
          color={colors.text}
        >
          Add recipient
        </ResponsiveUi.Text>
        <TouchableOpacity
          className="mt-12 w-4/5 flex-row items-center justify-between"
          activeOpacity={0.85}
          onPress={() => setIsInstitutionModalVisible(true)}
        >
          <ResponsiveUi.Text
            color={selectedInstitution ? colors.text : colors.secondary}
            fontSize={18}
          >
            {selectedInstitution?.name ?? "Select bank"}
          </ResponsiveUi.Text>
          <ChevronDown color={colors.secondary} />
        </TouchableOpacity>
        <View className="w-full mt-8 justify-center items-center">
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
              borderRadius: 8,
              fontSize: 18,
              lineHeight: 22,
              height: 50,
              width: "80%",
              paddingVertical: 0,
            }}
            keyboardType="numeric"
          />

          {isVerifyingAccount ? (
            <View className="w-4/5 mt-3 flex-row items-center">
              <ActivityIndicator size="small" color={colors.primary} />
              <ResponsiveUi.Text
                fontSize={13}
                color={colors.secondary}
                tailwind="ml-2"
              >
                Verifying account details...
              </ResponsiveUi.Text>
            </View>
          ) : null}

          {!isVerifyingAccount && resolvedAccountName ? (
            <View className="w-4/5 mt-3">
              <ResponsiveUi.Text fontSize={13} color={colors.primary}>
                {resolvedAccountName}
              </ResponsiveUi.Text>
            </View>
          ) : null}

          {!isVerifyingAccount && accountVerificationError ? (
            <View className="w-4/5 mt-3">
              <ResponsiveUi.Text fontSize={13} color={colors.secondary}>
                {accountVerificationError}
              </ResponsiveUi.Text>
            </View>
          ) : null}
        </View>
      </View>
      <View className="flex-1 justify-end">
        <ResponsiveUi.Button
          action={() => {}}
          className="mt-12 w-full"
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
    </AppLayout>
  );
};

export default SwapDetails;
