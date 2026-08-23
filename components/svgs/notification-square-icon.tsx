import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function NotificationSquareIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M10.333 5h-.666c-2.985 0-4.478 0-5.405.928-.928.927-.928 2.42-.928 5.405 0 2.986 0 4.479.928 5.406.927.928 2.42.928 5.405.928 2.986 0 4.479 0 5.406-.928.928-.927.928-2.42.928-5.406v-.666"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M16.667 6.667a2.333 2.333 0 11-4.666 0 2.333 2.333 0 014.666 0z"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
      />
      <Path
        d="M6.667 10.667h2.667M6.667 14H12"
        stroke={props.color ?? "#fff"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default NotificationSquareIcon;
