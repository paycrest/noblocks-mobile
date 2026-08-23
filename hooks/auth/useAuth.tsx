import {
  PrivyUser,
  useLoginWithEmail,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/expo";

import { useSelector } from "@/store/Store";
import { useLinkWithPasskey } from "@privy-io/expo/passkey";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeOtpCode(code: string): string {
  return code.replace(/\D/g, "").trim();
}

function getPrivyUserEmail(privyUser: PrivyUser | null | undefined): string | null {
  const emailAccount = privyUser?.linked_accounts?.find(
    (account) => account.type === "email",
  );

  if (!emailAccount || !("address" in emailAccount)) {
    return null;
  }

  return normalizeAuthEmail(String(emailAccount.address));
}

function isAlreadyLoggedInError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error ?? "");
  return message.toLowerCase().includes("already logged in");
}

const useAuth = () => {
  const { saveUserInfo, logoutAndClearState, setNewInstall } = useSelector([
    "saveUserInfo",
    "logoutAndClearState",
    "setNewInstall",
  ]);
  const { logout, user } = usePrivy();
  const { initMfaEnrollment, submitMfaEnrollment } = useMfaEnrollment();

  const navigateAfterLogin = useCallback(
    async (loggedInUser: PrivyUser, _isNewUser: boolean) => {
      saveUserInfo(loggedInUser);

      // Existing accounts: home. New-account KYC/wallet setup deferred.
      router.replace("/(tabs)");
      setNewInstall(false);
    },
    [saveUserInfo, setNewInstall],
  );

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onLoginSuccess: async (loggedInUser, isNewUser) => {
      await navigateAfterLogin(loggedInUser, !!isNewUser);
    },
  });

  const { linkWithPasskey } = useLinkWithPasskey();

  const clearPrivySession = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Ignore — we are resetting auth before a fresh email login.
    }
  }, [logout]);

  const loginUser = useCallback(
    async (
      email: string,
      code: string,
    ): Promise<{ success: true } | { success: false; message: string }> => {
      const normalizedEmail = normalizeAuthEmail(email);
      const normalizedCode = normalizeOtpCode(code);

      if (!normalizedEmail || normalizedCode.length !== 6) {
        return {
          success: false,
          message: "Enter the 6-digit code sent to your email.",
        };
      }

      try {
        await loginWithCode({
          code: normalizedCode,
          email: normalizedEmail,
        });
        return { success: true };
      } catch (error) {
        if (isAlreadyLoggedInError(error) && user) {
          const activeEmail = getPrivyUserEmail(user);
          if (!activeEmail || activeEmail === normalizedEmail) {
            await navigateAfterLogin(user, false);
            return { success: true };
          }
        }

        const message =
          error instanceof Error
            ? error.message
            : "Invalid or expired code. Please try again.";
        return { success: false, message };
      }
    },
    [loginWithCode, navigateAfterLogin, user],
  );

  const sendLoginCode = useCallback(
    async (email: string): Promise<boolean> => {
      const normalizedEmail = normalizeAuthEmail(email);

      if (!normalizedEmail) {
        return false;
      }

      try {
        await clearPrivySession();
        await sendCode({ email: normalizedEmail });
        router.navigate({
          pathname: "/(auth)/otp-screen",
          params: { email: normalizedEmail },
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
    },
    [clearPrivySession, sendCode],
  );

  const resendLoginCode = useCallback(
    async (email: string): Promise<boolean> => {
      const normalizedEmail = normalizeAuthEmail(email);

      if (!normalizedEmail) {
        return false;
      }

      try {
        await sendCode({ email: normalizedEmail });
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to send login code.";
        Alert.alert("Unable to resend code", message);
        return false;
      }
    },
    [sendCode],
  );

  const logoutUser = useCallback(async () => {
    await logout();
    logoutAndClearState();
    router.replace("/(auth)/login");
  }, [logout, logoutAndClearState]);

  const acceptTermsOfService = useCallback(async () => {
    router.replace("/(tabs)");
  }, []);

  const handleEnrollmentWithPasskey = async (): Promise<boolean> => {
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
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Passkey enrollment failed.";
      Alert.alert("Passkey setup failed", message);
      return false;
    }
  };

  const handleEnrollmentWithTotp = async (): Promise<boolean> => {
    try {
      await initMfaEnrollment({ method: "totp" });
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Authenticator setup failed.";
      Alert.alert("Authenticator setup failed", message);
      return false;
    }
  };

  const handleEnrollmentWithSms = async (): Promise<boolean> => {
    try {
      await initMfaEnrollment({ method: "sms" });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "SMS setup failed.";
      Alert.alert("SMS setup failed", message);
      return false;
    }
  };

  const verifyTotpEnrollment = async (code: string): Promise<boolean> => {
    try {
      await submitMfaEnrollment({
        method: "totp",
        code: normalizeOtpCode(code),
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification failed.";
      Alert.alert("Verification failed", message);
      return false;
    }
  };

  return {
    loginUser,
    sendLoginCode,
    resendLoginCode,
    logoutUser,
    acceptTermsOfService,
    handleEnrollmentWithPasskey,
    handleEnrollmentWithTotp,
    handleEnrollmentWithSms,
    verifyTotpEnrollment,
  };
};

export default useAuth;
