import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function CryptoNetwork(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10z"
        fill="#0153FF"
      />
      <Path
        d="M10.16 17.143c3.857 0 6.984-3.121 6.984-6.972 0-3.85-3.127-6.972-6.984-6.972A6.98 6.98 0 003.2 9.585h9.231v1.172h-9.23a6.98 6.98 0 006.959 6.386z"
        fill="#fff"
      />
    </Svg>
  );
}

export default CryptoNetwork;
