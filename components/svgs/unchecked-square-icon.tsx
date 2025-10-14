import * as React from "react";

import Svg, { Defs, G, Path, SvgProps } from "react-native-svg";

/* SVGR has dropped some elements not supported by react-native-svg: filter */

function UncheckedSquareIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <G filter="url(#filter0_d_1_14521)">
        <Path
          d="M4.75 8.748a4 4 0 014-4h6.5a4 4 0 014 4v6.5a4 4 0 01-4 4h-6.5a4 4 0 01-4-4v-6.5z"
          stroke="#fff"
          strokeOpacity={0.3}
          strokeWidth={1.5}
          //   shapeRendering="crispEdges"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default UncheckedSquareIcon;
