import * as React from "react";

import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import Svg, { Path, SvgProps } from "react-native-svg";

interface LogoProps extends SvgProps {
  showWordmark?: boolean;
}

function Logo({ showWordmark = true, ...props }: LogoProps) {
  const colors = useThemeColors();

  return (
    <>
      <Svg width={36} height={36} viewBox="0 0 703 694" fill="none" {...props}>
        <Path
          d="M702.99 0.390137V693.36H527.75V263.26C527.75 214.895 488.535 175.64 440.12 175.64C391.73 175.64 352.5 214.87 352.5 263.26V693.36H0V0.390137H702.99Z"
          fill="#43B9FB"
        />
      </Svg>
      {showWordmark ? (
        <ResponsiveUi.Text
          semiBold
          tailwind="font-inter-semi-bold"
          style={{
            fontSize: 28,
            lineHeight: 36,
            marginTop: 24,
            color: colors.text,
          }}
        >
          Noblocks
        </ResponsiveUi.Text>
      ) : null}
    </>
  );
}

export default Logo;
