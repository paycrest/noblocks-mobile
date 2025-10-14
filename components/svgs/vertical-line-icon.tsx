import * as React from "react";

import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from "react-native-svg";

function VerticalLineIcon(props: SvgProps) {
  return (
    <Svg width={1} height={220} viewBox="0 0 1 220" fill="none" {...props}>
      <Path
        stroke="url(#paint0_linear_1_14699)"
        d="M0.5 219.998L0.49999 -0.00170896"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1_14699"
          x1={1.49999}
          y1={-0.00170901}
          x2={1.5}
          y2={219.998}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#fff" stopOpacity={0} />
          <Stop offset={0.360616} stopColor="#fff" stopOpacity={0.1} />
          <Stop offset={0.774083} stopColor="#fff" stopOpacity={0.1} />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default VerticalLineIcon;
