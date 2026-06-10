/** Shared motion for bottom sheets and popup modals — aligned with liquid glass screens. */

export const LIQUID_GLASS_SHEET_BACKDROP_OPACITY = 0.45;

export const LIQUID_GLASS_SHEET_ENTER_MS = 480;
export const LIQUID_GLASS_SHEET_EXIT_MS = 340;

export const LIQUID_GLASS_SHEET_BACKDROP_IN_MS = 320;
export const LIQUID_GLASS_SHEET_BACKDROP_OUT_MS = 280;

export const LIQUID_GLASS_SHEET_SWIPE_THRESHOLD = 100;

export const LIQUID_GLASS_SHEET_RADIUS = 28;
export const LIQUID_GLASS_SHEET_RADIUS_LARGE = 40;

/** react-native-modal custom enter — subtle rise + fade (matches swap entry feel). */
export const liquidGlassSheetEnterAnimation = {
  from: {
    translateY: 56,
    opacity: 0.88,
  },
  to: {
    translateY: 0,
    opacity: 1,
  },
} as const;

/** react-native-modal custom exit — drops slightly while fading. */
export const liquidGlassSheetExitAnimation = {
  from: {
    translateY: 0,
    opacity: 1,
  },
  to: {
    translateY: 48,
    opacity: 0.9,
  },
} as const;
