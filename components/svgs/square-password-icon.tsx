import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function SquarePasswordIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M9.493 12h.007M5.333 12h.008M5.333 8h9.334c.736 0 1.103 0 1.228.16.125.16.04.465-.15 1.075l-.667 2.333c-.19.61-.284.915-.502 1.132-.219.218-.524.313-1.134.503l-2.333.667c-.61.19-.915.285-1.075.16-.16-.125-.16-.492-.16-1.228V8.667c0-.736 0-1.104-.16-1.228-.125-.16-.465-.04-1.075.15l-2.333.667c-.61.19-.915.284-1.132.503-.218.219-.313.524-.503 1.134l-.667 2.333c-.19.61-.285.915-.16 1.075.125.16.492.16 1.228.16h9.334c.736 0 1.104 0 1.228-.16.16-.125.04-.465-.15-1.075l-.667-2.333"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.667 8V6.667a3.333 3.333 0 116.666 0V8"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SquarePasswordIcon;
