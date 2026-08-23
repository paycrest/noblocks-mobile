export const ONBOARDING_LOGIN_EXIT_MS = 380;
export const ONBOARDING_LOGIN_ENTER_MS = 480;

let pendingOnboardingToLogin = false;

export function prepareOnboardingToLoginTransition() {
  pendingOnboardingToLogin = true;
}

export function consumeOnboardingToLoginTransition(): boolean {
  const shouldAnimate = pendingOnboardingToLogin;
  pendingOnboardingToLogin = false;
  return shouldAnimate;
}
