import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

import { ResponsiveUi } from "../ResponsiveUi";

function Logo(props: SvgProps) {
  return (
    <>
      <Svg width={37} height={36} viewBox="0 0 37 36" fill="none" {...props}>
        <Path
          d="M.5 36h20.955V11.201a3.882 3.882 0 013.875-3.887c2.141 0 3.876 1.741 3.876 3.887V36H36.5V0H.5v36z"
          fill="#43B9FB"
        />
      </Svg>
      <ResponsiveUi.Text
        style={{
          fontWeight: "600",
          fontFamily: "font-inter-bold",
          fontSize: 24,
        }}
        tailwind="text-[60px] mt-6"
      >
        Noblocks
      </ResponsiveUi.Text>
    </>
  );
}

export default Logo;
