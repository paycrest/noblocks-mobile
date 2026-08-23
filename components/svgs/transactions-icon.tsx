import * as React from "react";

import Svg, { Circle, Path, SvgProps } from "react-native-svg";

import { useThemeColors } from "@/hooks/useThemeColor";

type Props = SvgProps & {
  focused?: boolean;
};

function TransactionsIcon({ focused = false, color, ...props }: Props) {
  const colors = useThemeColors();
  const tint = color ?? colors.secondary;

  if (focused) {
    return (
      <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
        <Circle cx={16} cy={16} r={13} fill={tint} />
        <Path
          d="M16 9.5V16H20.5"
          stroke={colors.background}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M16 7.43333V16H20M27 16C27 22.6275 22.1275 27.5 16 27.5C9.87259 27.5 5 22.6275 5 16C5 9.37259 9.87259 4.5 16 4.5C22.1275 4.5 27 9.37259 27 16Z"
        stroke={tint}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default TransactionsIcon;
