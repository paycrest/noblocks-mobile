import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

function PersonIcon(props: SvgProps) {
  return (
    <Svg width={39} height={39} viewBox="0 0 39 39" fill="none" {...props}>
      <Circle cx={19.5} cy={19.5} r={19.5} fill="#8B85F4" />
      <Path
        d="M28.998 20.5c1.656 0 3.04 1.363 2.646 2.972C30.311 28.941 25.38 33 19.5 33c-5.88 0-10.81-4.059-12.144-9.528-.393-1.61.992-2.972 2.65-2.972H28.997z"
        fill="#fff"
      />
    </Svg>
  );
}

export default PersonIcon;
