import {
  PrivyUser,
  useLoginWithEmail,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/expo";

import { useSelector } from "@/store/Store";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useLinkWithPasskey } from "@privy-io/expo/passkey";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

const useAuth = () => {
  const { create } = useEmbeddedEthereumWallet();
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onLoginSuccess: (user, isNewUser) => {
      navigateAfterLogin(user, !!isNewUser);
    },
  });
  const { linkWithPasskey } = useLinkWithPasskey();
  const { saveUserInfo, logoutAndClearState, setNewInstall } = useSelector([
    "saveUserInfo",
    "logoutAndClearState",
    "setNewInstall",
  ]);
  const { logout, user } = usePrivy();
  const { initMfaEnrollment, submitMfaEnrollment } = useMfaEnrollment();

  const navigateAfterLogin = async (user: PrivyUser, isNewUser: boolean) => {
    saveUserInfo(user);
    if (isNewUser) {
      await create();
      router.replace("/(auth)/kyc");
    } else {
      router.replace("/(tabs)");
    }
    setNewInstall(false);
  };

  const loginUser = async (email: string, code: string): Promise<boolean> => {
    try {
      await loginWithCode({
        code,
        email,
      });
      return true;
    } catch {
      return false;
    }
  };

  const sendLoginCode = useCallback(async (email: string): Promise<boolean> => {
    try {
      await sendCode({ email });
      router.navigate({
        pathname: "/(auth)/otp-screen",
        params: { email },
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send login code.";
      Alert.alert("Unable to send code", message);
      return false;
    }
  }, [sendCode]);

  const logoutUser = useCallback(async () => {
    await logout();
    logoutAndClearState();
    router.replace("/(auth)/login");
  }, [logout, logoutAndClearState]);

  const acceptTermsOfService = useCallback(async () => {
    router.replace("/(tabs)");
  }, []);

  const handleEnrollmentWithPasskey = async () => {
    try {
      await linkWithPasskey({
        relyingParty: "roosta-landing-page.vercel.app",
      });
      await initMfaEnrollment({ method: "passkey" });
      const credentialIds = user?.linked_accounts
        .filter((account): account is any => account.type === "passkey")
        .map((account) => account.credentialId);

      await submitMfaEnrollment({
        method: "passkey",
        credentialIds: credentialIds as string[],
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Passkey enrollment failed.";
      Alert.alert("Passkey setup failed", message);
    }
  };

  return {
    loginUser,
    sendLoginCode,
    logoutUser,
    acceptTermsOfService,
    handleEnrollmentWithPasskey,
  };
};

export default useAuth;
