import {
  useLoginWithEmail,
  useMfa,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/expo";

import { useSelector } from "@/app/store/Store";
import { useLinkWithPasskey } from "@privy-io/expo/passkey";
import { router } from "expo-router";
import { useCallback } from "react";

const useAuth = () => {
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { linkWithPasskey } = useLinkWithPasskey();
  const { saveUserInfo, logoutAndClearState } = useSelector([
    "saveUserInfo",
    "logoutAndClearState",
  ]);
  const { logout, user, getAccessToken, isReady } = usePrivy();
  const { initMfaEnrollment, submitMfaEnrollment } = useMfaEnrollment();
  const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
  const client_id = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID;
  const currentTime = Math.floor(Date.now() / 1000);
  const { init, submit, cancel } = useMfa();

  const loginUser = useCallback(
    async (email: string, code: string) => {
      try {
        const response = await loginWithCode({
          code,
          email,
        });
        console.log(isReady, response);
        if (isReady && response) {
          const isFirstTime = Math.abs(currentTime - response?.created_at) < 10;
          saveUserInfo(response);
          if (isFirstTime) {
            router.replace("/(auth)/kyc");
          } else {
            router.replace("/(tabs)");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [loginWithCode, router]
  );

  const sendLoginCode = useCallback(async (email: string) => {
    try {
      const response = await sendCode({
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
