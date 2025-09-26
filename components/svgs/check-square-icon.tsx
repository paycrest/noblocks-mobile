import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function CheckSquareIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M16 3.998a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-8a4 4 0 014-4h8zm-.23 5.21a.75.75 0 00-1.06.02l-3.765 3.908-1.629-1.879a.75.75 0 00-1.18.922l.048.06 2.166 2.5a.752.752 0 001.107.03l4.333-4.5a.75.75 0 00-.02-1.06z"
        fill="#5D5DC9"
      />
    </Svg>
  );
}

export default CheckSquareIcon;
