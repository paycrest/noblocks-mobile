import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

import { useThemeColors } from "@/hooks/useThemeColor";

type Props = SvgProps & {
  focused?: boolean;
};

function WalletIcon({ focused = false, color, ...props }: Props) {
  const colors = useThemeColors();
  const tint = color ?? colors.secondary;

  if (focused) {
    return (
      <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
        <Path
          d="M24.104 5.5H7.896C5.192 5.5 3 7.692 3 9.95v13.1C3 25.308 5.192 27.5 7.896 27.5h16.208C26.808 27.5 29 25.308 29 23.05V9.95C29 7.692 26.808 5.5 24.104 5.5z"
          fill={tint}
        />
        <Path
          d="M9 11h7.172"
          stroke={colors.background}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M24.104 5.5H7.896C5.192 5.5 3 7.692 3 9.95v13.1C3 25.308 5.192 27.5 7.896 27.5h16.208C26.808 27.5 29 25.308 29 23.05V9.95C29 7.692 26.808 5.5 24.104 5.5z"
        stroke={tint}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M9 11h7.172"
        stroke={tint}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default WalletIcon;
