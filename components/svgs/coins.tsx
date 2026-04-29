import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function Coins(props: SvgProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        d="M8.75 11.667A5.333 5.333 0 108.75 1a5.333 5.333 0 000 10.667z"
        stroke="#8A8AA3"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M8.195 13.646a4.932 4.932 0 01-6.757-6.757"
        stroke="#8A8AA3"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default Coins;
