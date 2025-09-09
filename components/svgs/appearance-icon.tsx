import * as React from "react";

import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

function AppearanceIcon(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z"
        fill="#6C67BD"
      />
      <G clipPath="url(#clip0_1_9733)">
        <Path
          d="M19.72 14.473a4.007 4.007 0 00-4.773 2.387m4.773-2.387a4.002 4.002 0 01-1.054 7.86A3.985 3.985 0 0116 21.315m3.72-6.842a4 4 0 10-7.44 0m2.667 2.387c-.181.456-.28.953-.28 1.473A3.99 3.99 0 0016 21.315m-1.053-4.455a4.01 4.01 0 01-2.667-2.387m0 0a4.002 4.002 0 001.053 7.86A3.985 3.985 0 0016 21.315"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1_9733">
          <Path fill="#fff" transform="translate(8 8)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default AppearanceIcon;
