import { useThemeColors } from "@/hooks/useThemeColor";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function BackButton(props: SvgProps) {
  const colors = useThemeColors();
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none" {...props}>
      <Path
        d="M17.5 7s-7 5.155-7 7c0 1.845 7 7 7 7"
        stroke={colors.text}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default BackButton;
