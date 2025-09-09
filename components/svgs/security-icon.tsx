import * as React from "react";

import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

function SecurityIcon(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z"
        fill="#CC3681"
      />
      <G
        clipPath="url(#clip0_1_9747)"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <Path
          d="M9.667 14c.02-.536.08-1.082.18-1.633.074-.411.11-.617.238-.757.126-.14.44-.24 1.065-.44 1.54-.49 2.841-1.837 4.85-1.837 2.007 0 3.31 1.346 4.85 1.837.626.2.94.3 1.066.44.127.14.164.346.238.757.1.55.16 1.097.18 1.633m-1.37 5.333c-.88 1.349-2.179 2.425-3.887 3.079-.445.17-.667.255-1.076.255-.408 0-.63-.085-1.075-.255-1.709-.654-3.008-1.73-3.888-3.079"
          strokeLinejoin="round"
        />
        <Path d="M13.667 16l.667.667m0 0l.666.666m-.666-.666L15 16m-.666.667l-.667.666M10.333 16l.667.667m0 0l.666.666M11 16.667l.666-.667m-.666.667l-.667.666M17 16l.667.667m0 0l.666.666m-.666-.666l.666-.667m-.666.667l-.667.666M20.333 16l.667.667m0 0l.666.666M21 16.667l.666-.667m-.666.667l-.667.666" />
      </G>
      <Defs>
        <ClipPath id="clip0_1_9747">
          <Path fill="#fff" transform="translate(8 8)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SecurityIcon;
