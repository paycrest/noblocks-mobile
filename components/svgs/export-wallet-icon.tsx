import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function ExportWalletIcon(props: SvgProps) {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none" {...props}>
      <Path
        d="M4.5 16.498c0-5.624 0-8.437 1.432-10.408a7.5 7.5 0 011.66-1.66C9.563 2.999 12.375 2.999 18 2.999c5.625 0 8.437 0 10.408 1.433a7.5 7.5 0 011.66 1.659C31.5 8.06 31.5 10.874 31.5 16.498v3c0 5.625 0 8.437-1.432 10.409a7.5 7.5 0 01-1.66 1.659c-1.971 1.432-4.783 1.432-10.408 1.432-5.625 0-8.437 0-10.408-1.432a7.5 7.5 0 01-1.66-1.66C4.5 27.937 4.5 25.124 4.5 19.499v-3z"
        stroke="#FF571F"
        strokeWidth={3}
      />
      <Path
        d="M22.5 19.498l-1.286-3m-7.714 3l1.286-3m0 0l2.325-5.426a.963.963 0 01.889-.574c.39 0 .74.227.889.574l2.325 5.426m-6.428 0h6.428M12 25.498h12"
        stroke="#FF571F"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ExportWalletIcon;
