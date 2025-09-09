import * as React from "react";

import Svg, { G, Path, SvgProps } from "react-native-svg";

function WalletIcon(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <G opacity={1}>
        <Path
          d="M24.104 4.5V4v.5zM29.5 9.95h.5-.5zm0 13.1h.5-.5zm-5.396 5.45v.5-.5zm-16.208 0v.5-.5zM2.5 23.05H2h.5zm0-13.1H2h.5zM7.896 4.5V4v.5zm0 1V5v.5zM3.5 9.95H3h.5zm0 13.1H3h.5zm4.396 4.45v.5-.5zm16.207 0v.5-.5zm4.397-4.45h.5-.5zm0-13.1h.5-.5zM24.104 5.5V5v.5zm0-1V5C26.808 5 29 7.216 29 9.95h1C30 6.675 27.37 4 24.104 4v.5zM29.5 9.95H29v13.1h1V9.95h-.5zm0 13.1H29c0 2.734-2.192 4.95-4.896 4.95v1C27.37 29 30 26.326 30 23.05h-.5zm-5.396 5.45V28H7.896v1h16.207v-.5zm-16.208 0V28C5.193 28 3 25.784 3 23.05H2C2 26.326 4.63 29 7.896 29v-.5zM2.5 23.05H3V9.95H2v13.1h.5zm0-13.1H3C3 7.216 5.192 5 7.897 5V4C4.63 4 2 6.675 2 9.95h.5zM7.896 4.5V5h16.207V4H7.896v.5zm0 1V5C5.192 5 3 7.216 3 9.95h1C4 7.758 5.755 6 7.897 6v-.5zM3.5 9.95H3v13.1h1V9.95h-.5zm0 13.1H3C3 25.784 5.192 28 7.896 28v-1C5.756 27 4 25.241 4 23.05h-.5zm4.396 4.45v.5h16.207v-1H7.896v.5zm16.207 0v.5C26.808 28 29 25.784 29 23.05h-1C28 25.24 26.245 27 24.104 27v.5zm4.397-4.45h.5V9.95h-1v13.1h.5zm0-13.1h.5C29 7.216 26.808 5 24.104 5v1C26.245 6 28 7.758 28 9.95h.5zM24.104 5.5V5H7.896v1h16.207v-.5z"
          fill={props.color ?? "#fff"}
          fillOpacity={1}
        />
        <Path
          d="M9 11h7.172"
          stroke={props.color ?? "#fff"}
          strokeOpacity={1}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

export default WalletIcon;
