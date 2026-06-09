import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function TwoFactorIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M10 2.5l1.25 2.5 2.75.4-2 1.95.47 2.74L10 9.25 7.53 10.09l.47-2.74-2-1.95 2.75-.4L10 2.5z"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.333 14.167v1.666c0 .736 0 1.104.16 1.228.125.16.465.04 1.075-.15l2.333-.667c.61-.19.915-.284 1.132-.503.218-.219.313-.524.503-1.134l.667-2.333c.19-.61.285-.915.16-1.075-.125-.16-.492-.16-1.228-.16H5.333c-.736 0-1.104 0-1.228.16-.16.125-.16.492-.16 1.228v1.666"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default TwoFactorIcon;
