import type { ComponentType } from "react";

import OnboardingIcon1 from "@/components/svgs/onboarding-icon1";
import OnboardingIcon2 from "@/components/svgs/onboarding-icon2";

const onboardingHero = require("@/assets/images/onboarding-hero.png");

export type OnboardingSlide = {
  id: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  illustration:
    | { type: "image"; source: number; width: number; height: number }
    | {
        type: "component";
        Component: ComponentType<{ width?: number; height?: number }>;
      };
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "swap-easy",
    titleLine1: "Crypto to Fiat",
    titleLine2: "Easy-peeazzy",
    body: "Converting your crypto to fiat has never been easier. No long processes",
    illustration: {
      type: "image",
      source: onboardingHero,
      width: 340,
      height: 197,
    },
  },
  {
    id: "fast-swaps",
    titleLine1: "Swap in",
    titleLine2: "Seconds",
    body: "Move from crypto to local currency with a flow built for speed and clarity.",
    illustration: {
      type: "component",
      Component: OnboardingIcon1,
    },
  },
  {
    id: "stay-secure",
    titleLine1: "Stay in",
    titleLine2: "Control",
    body: "Track every step from wallet to payout with transparent status updates.",
    illustration: {
      type: "component",
      Component: OnboardingIcon2,
    },
  },
];
