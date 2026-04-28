import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function ArrowDataTransfer(props: SvgProps) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none" {...props}>
      <Path
        d="M9.5 4.5H3.32928C2.82639 4.5 2.57494 4.5 2.51236 4.34567C2.44978 4.19134 2.62758 4.00971 2.98319 3.64645L4.10545 2.5"
        stroke="#8A8AA3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 7.5H8.67072C9.17361 7.5 9.42506 7.5 9.48764 7.65433C9.55022 7.80866 9.37242 7.99029 9.01681 8.35355L7.89455 9.5"
        stroke="#8A8AA3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowDataTransfer;
