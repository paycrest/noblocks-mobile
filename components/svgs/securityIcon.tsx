import * as React from "react";

import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <G
        clipPath="url(#clip0_1_14706)"
        stroke="#fff"
        strokeOpacity={0.5}
        strokeWidth={1.875}
        strokeLinecap="round"
      >
        <Path
          d="M10 1.664c-2.507 0-4.133 1.683-6.055 2.296-.781.25-1.172.374-1.33.55-.158.176-.204.432-.297.946-.991 5.497 1.175 10.578 6.341 12.556.555.213.833.319 1.343.319s.787-.106 1.342-.319c5.166-1.978 7.33-7.06 6.34-12.556-.094-.514-.14-.77-.298-.946-.158-.176-.549-.3-1.33-.55-1.923-.613-3.55-2.296-6.057-2.296z"
          strokeLinejoin="round"
        />
        <Path d="M10 5.83v1.666" />
      </G>
      <Defs>
        <ClipPath id="clip0_1_14706">
          <Path fill="#fff" transform="translate(0 -.002)" d="M0 0H20V20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
