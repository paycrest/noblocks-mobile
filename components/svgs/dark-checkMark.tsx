import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function DarkCheckMark(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm4.435-12.195a.93.93 0 10-1.429-1.191l-3.999 4.799-2.07-2.07a.93.93 0 00-1.316 1.315l2.791 2.79a.93.93 0 001.372-.062l4.651-5.581z"
        fill="#8B85F4"
      />
    </Svg>
  );
}

export default DarkCheckMark;
