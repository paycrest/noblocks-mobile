import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg";

function EthereumIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <G clipPath="url(#clip0_1_9134)">
        <Path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
          fill="#627EEA"
        />
        <Path
          d="M12.311 4.5v5.544l4.686 2.093L12.31 4.5z"
          fill="#fff"
          fillOpacity={0.602}
        />
        <Path d="M12.311 4.5l-4.686 7.637 4.686-2.093V4.5z" fill="#fff" />
        <Path
          d="M12.311 15.73v3.767L17 13.01l-4.689 2.72z"
          fill="#fff"
          fillOpacity={0.602}
        />
        <Path d="M12.311 19.497v-3.768L7.625 13.01l4.686 6.487z" fill="#fff" />
        <Path
          d="M12.311 14.858l4.686-2.72-4.686-2.093v4.813z"
          fill="#fff"
          fillOpacity={0.2}
        />
        <Path
          d="M7.625 12.137l4.686 2.721v-4.813l-4.686 2.092z"
          fill="#fff"
          fillOpacity={0.602}
        />
      </G>
      <Path
        d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1z"
        stroke="#202020"
        strokeWidth={2}
      />
      <Defs>
        <ClipPath id="clip0_1_9134">
          <Path
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
            fill="#fff"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default EthereumIcon;
