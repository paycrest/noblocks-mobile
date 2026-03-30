import {
  BiometricKYCParams,
  ConsentInformationParams,
  IdInfoParams,
  SmileConfig,
} from "@smile_identity/react-native-expo";

export const smile_id_config = new SmileConfig(
  "7101",
  "Swc8aGe3Ih8WsVOy2Lq63TfBgUkU4BxUWWGupLXG2LbV39LXK4vuWYMs59wRHjs7vCjFLnL9Q7ptCSHt7Ika/ggpCCsVFLrBxjs52qWUilSslPfqybjyqhjvtPnQpyKN0k0eJ2M8EL2qV+N1le2Ar4SZkU41AmANjKjY/GbBGi8=",
  "https://api.smileidentity.com/v1/",
  "https://testapi.smileidentity.com/v1/",
);

export const biometricKYCParams: BiometricKYCParams = {
  // userId: 'user123', // Optional user ID
  // jobId: 'job456', // Optional job ID
  allowNewEnroll: true,
  allowAgentMode: true,
  showAttribution: true,
  showInstructions: true,
  skipApiSubmission: false,
  useStrictMode: false,
  extraPartnerParams: {
    custom_param_1: "value1",
    custom_param_2: "value2",
  },
  consentInformation: {} as ConsentInformationParams, // Optional consent information
  idInfo: {} as IdInfoParams,
};
