import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function FaceIdIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M7.167 2.5H7C5.6 2.5 4.9 2.5 4.365 2.772A2.083 2.083 0 003.272 3.865C3 4.4 3 5.1 3 6.5v.167M7.167 17.5H7c-1.4 0-2.1 0-2.635-.273a2.083 2.083 0 01-.898-.897C3 15.6 3 14.9 3 13.5v-.167M18 6.667V6.5c0-1.4 0-2.1-.273-2.635a2.083 2.083 0 00-.897-.898C16.1 2.5 15.4 2.5 14 2.5h-.167M18 13.333v.167c0 1.4 0 2.1-.273 2.635a2.083 2.083 0 01-.897.898c-.535.272-1.235.272-2.635.272h-.167M6.75 6.667V7.917M14.25 6.667V7.917M9.667 10.5c.667 0 1.25-.583 1.25-1.25V6.667M13.167 12.667c-1.5 1.5-3.917 1.5-5.417 0"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default FaceIdIcon;
