import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

function UserSquareIcon(props: SvgProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M.75 8.667c0-3.732 0-5.598 1.16-6.758C3.068.75 4.934.75 8.666.75c3.732 0 5.598 0 6.757 1.16 1.16 1.159 1.16 3.025 1.16 6.757 0 3.732 0 5.598-1.16 6.757-1.16 1.16-3.025 1.16-6.757 1.16-3.732 0-5.598 0-6.758-1.16C.75 14.264.75 12.399.75 8.667z"
        stroke="#8A8AA3"
        strokeWidth={1.5}
      />
      <Path
        d="M4.917 12.833c1.943-2.035 5.536-2.13 7.5 0m-1.671-6.25c0 1.15-.934 2.084-2.087 2.084a2.085 2.085 0 01-2.086-2.084c0-1.15.934-2.083 2.086-2.083 1.153 0 2.087.933 2.087 2.083z"
        stroke="#8A8AA3"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default UserSquareIcon;
