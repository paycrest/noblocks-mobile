import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

import { useThemeColors } from "@/hooks/useThemeColor";

function SignOutIcon(props: SvgProps) {
  const colors = useThemeColors();
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z"
        fill={colors.place_holder}
        fillOpacity={0.1}
      />
      <Path
        d="M18 19.75c-.05 1.235-1.078 2.283-2.456 2.25-.32-.009-.717-.12-1.51-.344-1.908-.538-3.564-1.442-3.961-3.468-.073-.373-.073-.792-.073-1.63v-1.116c0-.838 0-1.257.073-1.63.397-2.026 2.053-2.93 3.961-3.468.793-.224 1.19-.335 1.51-.343 1.378-.034 2.407 1.014 2.456 2.249"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M22 16h-7.333M22 16c0-.467-1.33-1.339-1.666-1.667M22 16c0 .467-1.33 1.339-1.666 1.667"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SignOutIcon;
