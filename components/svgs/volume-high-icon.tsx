import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function VolumeHighIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M3.333 7.5v5h2.5L10 16.667V3.333L5.833 7.5H3.333z"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M13.333 7.083a3.333 3.333 0 010 5.834M15.833 4.583a6.667 6.667 0 010 10.834"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default VolumeHighIcon;
