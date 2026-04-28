import {
  PrivyUser,
  useLoginWithEmail,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/expo";

import { useSelector } from "@/app/store/Store";
import { useEmbeddedEthereumWallet } from "@privy-io/expo";
import { useLinkWithPasskey } from "@privy-io/expo/passkey";
import { router } from "expo-router";
import { useCallback } from "react";

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
  const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
  const client_id = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID;

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

  const loginUser = async (email: string, code: string) => {
    try {
      await loginWithCode({
        code,
        email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendLoginCode = useCallback(async (email: string) => {
    try {
      await sendCode({
        email,
      });
      router.navigate({
        pathname: "/(auth)/otp-screen",
        params: {
          email,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    await logout();
    logoutAndClearState();
    router.replace("/(auth)/login");
  }, []);

  // const useBiometricAuth = useCallback(async () => {
  //   // Step 1: check if biometrics is available
  //   const compatible = await LocalAuthentication.hasHardwareAsync();
  //   const enrolled = await LocalAuthentication.isEnrolledAsync();

  //   if (!compatible || !enrolled) {
  //     Alert.alert("Biometric authentication not available");
  //     return;
  //   }

  //   // Step 2: prompt biometric
  //   const result = await LocalAuthentication.authenticateAsync({
  //     promptMessage: "Authenticate to continue",
  //     fallbackLabel: "Use passcode", // iOS only
  //     cancelLabel: "Cancel",
  //   });

  //   if (!result.success) {
  //     Alert.alert("Authentication failed or cancelled");
  //     return;
  //   }

  //   // Step 3: call Privy
  //   try {
  //     if (!authenticated) {
  //       await login(); // trigger Privy login
  //     }

  //     Alert.alert("Authenticated with Privy", `Welcome ${user?.id}`);
  //     // You could also trigger a wallet action here
  //   } catch (e: any) {
  //     console.error("Privy error:", e);
  //     Alert.alert("Privy error", e.message ?? "Something went wrong");
  //   }
  // }, [])

  const acceptTermsOfService = useCallback(async () => {
    router.replace("/(tabs)");
    // const token = await getAccessToken();
    // console.log(token);
    // try {
    //   const response = await axios.post(
    //     `https://api.privy.io/v1/users/${user?.id}/fiat/tos`,
    //     {
    //       provider: "bridge-sandbox",
    //     },
    //     {
    //       headers: {
    //         Authorization:
    //           "Basic 3vxPyaX4gswMK3L8Z9EhxJYU6wek3fzst74qgNVuLvPkPGVwiasxsN79nvYoUSUwJtLutCi4RnioPEcy3rJTzZjt", // your base64-encoded API key
    //         "Content-Type": "application/json",
    //         "privy-app-id": appId,
    //       },
    //     }
    //   );
    //   console.log("TOS accepted:", response.data);
    //   return response.data;
    // } catch (error: any) {
    //   console.error(
    //     "Failed to accept terms:",
    //     error.response?.data || error.message
    //   );
    //   throw error;
    // }
  }, []);

  const handleEnrollmentWithPasskey = async () => {
    const linkPassKey = await linkWithPasskey({
      relyingParty: "roosta-landing-page.vercel.app",
    });
    console.log("link pass key", linkPassKey);
    const options = await initMfaEnrollment({ method: "passkey" });
    console.log("options", options);

    const credentialIds = user?.linked_accounts
      .filter((account): account is any => account.type === "passkey")
      .map((x) => x.credentialId);

    const response = await submitMfaEnrollment({
      method: "passkey",
      credentialIds: credentialIds as string[],
    });
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
