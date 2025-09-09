import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function ExportIcon(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16z"
        fill="#20BA90"
      />
      <Path
        d="M20.333 18.667c.338.327 1.667 1.2 1.667 1.666M20.333 22c.338-.328 1.667-1.2 1.667-1.667m0 0h-5.333M15.334 22.667h-.182c-2.174 0-3.261 0-4.016-.532a2.758 2.758 0 01-.57-.537C10 20.888 10 19.864 10 17.818v-1.697c0-1.975 0-2.963.312-3.752.503-1.268 1.566-2.268 2.913-2.741.838-.295 1.888-.295 3.987-.295 1.2 0 1.799 0 2.278.168.77.27 1.377.842 1.664 1.567.179.45.179 1.015.179 2.144v3.455"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 16c0-1.227.995-2.222 2.223-2.222.443 0 .967.078 1.398-.038a1.11 1.11 0 00.786-.786c.116-.431.038-.955.038-1.398 0-1.228.995-2.223 2.222-2.223"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ExportIcon;
