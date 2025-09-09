import * as React from "react";

import Svg, { Circle, Path, SvgProps } from "react-native-svg";

function TropicalIndigo(props: SvgProps) {
  return (
    <Svg width={47} height={47} viewBox="0 0 47 47" fill="none" {...props}>
      <Circle cx={23.5001} cy={23.4} r={23.4} fill="#8B85F4" />
      <Path
        d="M34.897 24.602c1.988 0 3.648 1.635 3.176 3.567-1.6 6.562-7.518 11.433-14.573 11.433-7.055 0-12.973-4.871-14.573-11.434-.471-1.931 1.191-3.566 3.18-3.566h22.79z"
        fill="#fff"
      />
    </Svg>
  );
}

export default TropicalIndigo;
