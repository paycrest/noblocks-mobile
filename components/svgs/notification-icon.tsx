import * as React from "react";

import Svg, { ClipPath, Defs, G, Path, SvgProps } from "react-native-svg";

function NotificationIcon(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z"
        fill="#4888FB"
      />
      <G clipPath="url(#clip0_1_9740)" stroke="#fff" strokeWidth={1.5}>
        <Path
          d="M16.333 10h-.667c-2.985 0-4.478 0-5.405.928-.928.927-.928 2.42-.928 5.405 0 2.986 0 4.479.928 5.406.927.928 2.42.928 5.405.928 2.986 0 4.479 0 5.406-.928.928-.927.928-2.42.928-5.406v-.666"
          strokeLinecap="round"
        />
        <Path d="M22.667 11.667a2.333 2.333 0 11-4.667 0 2.333 2.333 0 014.667 0z" />
        <Path
          d="M12.667 15.333h2.667M12.667 18.667H18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1_9740">
          <Path fill="#fff" transform="translate(8 8)" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default NotificationIcon;
