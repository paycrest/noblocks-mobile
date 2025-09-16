import { useLoginWithEmail, usePrivy } from "@privy-io/expo";

import { useSelector } from "@/app/store/Store";
import { router } from "expo-router";
import { useCallback } from "react";

const useAuth = () => {
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { saveUserInfo, logoutAndClearState } = useSelector([
    "saveUserInfo",
    "logoutAndClearState",
  ]);
  const { logout, user, getAccessToken, isReady } = usePrivy();
  const appId = process.env.EXPO_PUBLIC_PRIVY_APP_ID;
  const client_id = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID;
  const currentTime = Math.floor(Date.now() / 1000);

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

  return {
    loginUser,
    sendLoginCode,
    logoutUser,
    acceptTermsOfService,
  };
};

export default useAuth;
